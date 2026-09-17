import {
  VIVO_CATEGORY,
  VIVO_COMPANY_ID,
  VIVO_COMPANY_NAME,
  VIVO_LANDING_PAGE,
  getVivoClientType,
} from "@/lib/constants/vivo"
import { resolvePartner } from "@/lib/api/partner-resolver"
import { getUfFromPhone } from "@/lib/ddd-uf"
import {
  getOrderSession,
  getPartnerSessionFields,
  savePartnerData,
} from "@/lib/order-storage"
import { applyPartnerHashToUrl } from "@/lib/partner-hash"
import { toInternationalPhoneDigits } from "@/lib/phone"

export type TalkToUsMessagePayload = {
  company: string
  company_id: number
  business_partner: string
  partner_id?: number | null
  category: string
  landing_page: string
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

export type TalkToUsFormData = {
  name: string
  phone: string
  email: string
  message: string
}

const TALK_TO_US_API_URL = "https://evolution.bigdates.com.br:3720/telecom/vivo/messages"

function getCustomerCep() {
  try {
    const raw = localStorage.getItem("customer")
    if (!raw) return ""
    const customer = JSON.parse(raw) as { address?: { cep?: string } }
    return customer.address?.cep ?? ""
  } catch {
    return ""
  }
}

async function resolveTalkToUsPartner(phone: string) {
  const session = getOrderSession()
  const stored = getPartnerSessionFields()
  if (stored.partnerId != null) {
    return {
      partnerId: stored.partnerId,
      partnerName: stored.partnerName ?? session?.partnerName ?? "",
    }
  }

  const cep = getCustomerCep()
  const uf = getUfFromPhone(phone)

  try {
    const partner = await resolvePartner({
      cep,
      uf,
      clientType: getVivoClientType(),
    })

    if (partner) {
      if (partner.partner_hash) applyPartnerHashToUrl(partner.partner_hash)
      savePartnerData(partner)
      return {
        partnerId: partner.partner_id,
        partnerName: partner.partner_name,
      }
    }
  } catch {
    // Keep the stored partner if the resolver is unavailable.
  }

  return {
    partnerId: stored.partnerId ?? session?.partnerId ?? null,
    partnerName: stored.partnerName ?? session?.partnerName ?? "",
  }
}

export async function buildTalkToUsPayload(
  data: TalkToUsFormData,
): Promise<TalkToUsMessagePayload> {
  const phone = toInternationalPhoneDigits(data.phone)
  const { partnerId, partnerName } = await resolveTalkToUsPartner(phone)

  return {
    company: VIVO_COMPANY_NAME.toUpperCase(),
    company_id: VIVO_COMPANY_ID,
    business_partner: partnerName.trim() || VIVO_COMPANY_NAME,
    partner_id: partnerId ?? null,
    category: VIVO_CATEGORY,
    landing_page: VIVO_LANDING_PAGE,
    name: data.name.trim(),
    phone,
    email: data.email.trim(),
    subject: "Contato via site",
    message: data.message.trim(),
  }
}

export async function sendTalkToUsMessage(data: TalkToUsFormData) {
  const payload = await buildTalkToUsPayload(data)

  const response = await fetch(TALK_TO_US_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return {
    payload,
    data: (await response.json()) as { success: boolean },
  }
}
