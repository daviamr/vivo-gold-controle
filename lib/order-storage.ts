import { touchFlowTimestamp } from "@/lib/storage-expiry"
import { getPartnerHashFromUrl, isSamePartnerHash } from "@/lib/partner-hash"
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
}

export type PartnerSessionFields = {
  partnerId: number | null
  partnerName: string | null
  partnerLogoUrl: string | null
  partnerHash?: string | null
  partnerCnpj?: string | null
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
  }
}

export function savePartnerData(partner: PartnerData | null) {
  const session = getOrderSession()
  if (!session) return

  saveOrderSession({
    ...session,
    ...toPartnerSessionFields(partner),
  })
}

export function persistIncomingPartnerHash(partnerHash: string) {
  if (typeof window === "undefined" || !partnerHash) return

  const session = getOrderSession()
  const stored = readStoredPartnerFields()
  const currentHash = session?.partnerHash ?? stored?.partnerHash

  if (isSamePartnerHash(currentHash, partnerHash) && (session?.partnerHash || stored?.partnerHash)) {
    touchFlowTimestamp()
    return
  }

  const hashChanged = currentHash != null && !isSamePartnerHash(currentHash, partnerHash)
  const fields: PartnerSessionFields = hashChanged
    ? {
        partnerId: null,
        partnerName: null,
        partnerLogoUrl: null,
        partnerHash,
        partnerCnpj: null,
      }
    : {
        partnerId: session?.partnerId ?? stored?.partnerId ?? null,
        partnerName: session?.partnerName ?? stored?.partnerName ?? null,
        partnerLogoUrl: session?.partnerLogoUrl ?? stored?.partnerLogoUrl ?? null,
        partnerHash,
        partnerCnpj: session?.partnerCnpj ?? stored?.partnerCnpj ?? null,
      }

  persistPartnerFields(fields)
  touchFlowTimestamp()

  if (session) {
    saveOrderSession({
      ...session,
      ...fields,
    })
    return
  }

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
