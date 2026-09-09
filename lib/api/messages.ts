import {
  VIVO_COMPANY_ID,
  VIVO_COMPANY_NAME,
  VIVO_LANDING_PAGE,
} from "@/lib/constants/vivo"
import { resolvePartner } from "@/lib/api/partner-resolver"
import { getOrderSession } from "@/lib/order-storage"

export type TalkToUsMessagePayload = {
  company: string
  company_id: number
  business_partner: string
  partner_id?: number | null
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

async function resolveTalkToUsPartner() {
  const session = getOrderSession()

  if (session?.partnerId != null && session.partnerName) {
    return {
      partnerId: session.partnerId,
      partnerName: session.partnerName,
    }
  }

  const cep = getCustomerCep()
  if (!cep) {
    return {
      partnerId: session?.partnerId ?? null,
      partnerName: session?.partnerName ?? "",
    }
  }

  try {
    const partner = await resolvePartner(cep)
    return {
      partnerId: partner?.partner_id ?? session?.partnerId ?? null,
      partnerName: partner?.partner_name ?? session?.partnerName ?? "",
    }
  } catch {
    return {
      partnerId: session?.partnerId ?? null,
      partnerName: session?.partnerName ?? "",
    }
  }
}

export async function buildTalkToUsPayload(
  data: TalkToUsFormData,
): Promise<TalkToUsMessagePayload> {
  const { partnerId, partnerName } = await resolveTalkToUsPartner()

  return {
    company: VIVO_COMPANY_NAME.toUpperCase(),
    company_id: VIVO_COMPANY_ID,
    business_partner: partnerName.trim() || VIVO_COMPANY_NAME,
    partner_id: partnerId ?? null,
    landing_page: VIVO_LANDING_PAGE,
    name: data.name.trim(),
    phone: data.phone.replace(/\D/g, ""),
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
