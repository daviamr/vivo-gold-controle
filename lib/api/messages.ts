import {
  VIVO_CATEGORY,
  VIVO_COMPANY_ID,
  VIVO_COMPANY_NAME,
  VIVO_LANDING_PAGE,
} from "@/lib/constants/vivo"
import { getPartnerSessionFields } from "@/lib/order-storage"
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

export async function buildTalkToUsPayload(
  data: TalkToUsFormData,
): Promise<TalkToUsMessagePayload> {
  const phone = toInternationalPhoneDigits(data.phone)
  const stored = getPartnerSessionFields()
  const partnerId = stored.partnerId
  const partnerName = stored.partnerName ?? ""

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
