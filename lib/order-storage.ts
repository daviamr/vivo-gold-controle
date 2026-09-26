import { touchFlowTimestamp } from "@/lib/storage-expiry"
import { getPartnerHashFromUrl } from "@/lib/partner-hash"
import type { PartnerData } from "@/lib/api/partner-resolver"

const ORDER_SESSION_KEY = "vivo-order-session"
const PARTNER_SESSION_KEY = "vivo-partner-session"
export const ORDER_SESSION_EVENT = "vivo-order-session-changed"

export type OrderSession = {
  orderId: number
  orderToken: string
  expiresAt?: string
  partnerId: number | null
  partnerName: string | null
  partnerLogoUrl: string | null
  partnerHash?: string | null
  partnerCnpj?: string | null
  partnerResolved?: boolean
  resolvedForHash?: string | null
}

export type PartnerSessionFields = {
  partnerId: number | null
  partnerName: string | null
  partnerLogoUrl: string | null
  partnerHash?: string | null
  partnerCnpj?: string | null
  partnerResolved?: boolean
  resolvedForHash?: string | null
}

function notifyOrderSessionChanged() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(ORDER_SESSION_EVENT))
}

function persistPartnerFields(fields: PartnerSessionFields) {
  if (typeof window === "undefined") return
  localStorage.setItem(PARTNER_SESSION_KEY, JSON.stringify(fields))
}

function readStoredPartnerFields(): PartnerSessionFields | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(PARTNER_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PartnerSessionFields
  } catch {
    return null
  }
}

export function toPartnerSessionFields(partner: PartnerData | null) {
  return {
    partnerId: partner?.partner_id ?? null,
    partnerName: partner?.partner_name ?? null,
    partnerLogoUrl: partner?.logo_url ?? null,
    partnerHash: partner?.partner_hash ?? getPartnerHashFromUrl(),
    partnerCnpj: partner?.cnpj ?? null,
  }
}

export function saveOrderSession(session: OrderSession) {
  localStorage.setItem(ORDER_SESSION_KEY, JSON.stringify(session))
  persistPartnerFields({
    partnerId: session.partnerId,
    partnerName: session.partnerName,
    partnerLogoUrl: session.partnerLogoUrl,
    partnerHash: session.partnerHash,
    partnerCnpj: session.partnerCnpj,
    partnerResolved: session.partnerResolved,
    resolvedForHash: session.resolvedForHash,
  })
  touchFlowTimestamp()
  notifyOrderSessionChanged()
}

export function getOrderSession(): OrderSession | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(ORDER_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as OrderSession
  } catch {
    return null
  }
}

export function getPartnerSessionFields(): PartnerSessionFields {
  const session = getOrderSession()
  const stored = readStoredPartnerFields()

  return {
    partnerId: session?.partnerId ?? stored?.partnerId ?? null,
    partnerName: session?.partnerName ?? stored?.partnerName ?? null,
    partnerLogoUrl: session?.partnerLogoUrl ?? stored?.partnerLogoUrl ?? null,
    partnerHash: session?.partnerHash ?? stored?.partnerHash ?? getPartnerHashFromUrl(),
    partnerCnpj: session?.partnerCnpj ?? stored?.partnerCnpj ?? null,
    partnerResolved: session?.partnerResolved ?? stored?.partnerResolved ?? false,
    resolvedForHash: session?.resolvedForHash ?? stored?.resolvedForHash ?? null,
  }
}

export function isPartnerResolved() {
  return readStoredPartnerFields()?.partnerResolved === true
}

export function saveResolvedPartner(partner: PartnerData | null, resolvedForHash: string | null) {
  const fields: PartnerSessionFields = partner
    ? {
        ...toPartnerSessionFields(partner),
        partnerResolved: true,
        resolvedForHash,
      }
    : {
        partnerId: null,
        partnerName: null,
        partnerLogoUrl: null,
        partnerHash: null,
        partnerCnpj: null,
        partnerResolved: true,
        resolvedForHash,
      }

  const session = getOrderSession()
  if (session) {
    saveOrderSession({
      ...session,
      ...fields,
    })
    return
  }

  persistPartnerFields(fields)
  touchFlowTimestamp()
  notifyOrderSessionChanged()
}

export function clearOrderSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(ORDER_SESSION_KEY)
  notifyOrderSessionChanged()
}

export function clearPartnerSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(PARTNER_SESSION_KEY)
  notifyOrderSessionChanged()
}
