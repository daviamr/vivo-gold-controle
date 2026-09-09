"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { resolvePartner } from "@/lib/api/partner-resolver"
import { getPartnerHashFromUrl, applyPartnerHashToUrl } from "@/lib/partner-hash"
import {
  getOrderSession,
  saveOrderSession,
  toPartnerSessionFields,
} from "@/lib/order-storage"
import { tryUpdateOrder } from "@/lib/order-actions"
import { VIVO_CATEGORY, VIVO_COMPANY_NAME, VIVO_LANDING_PAGE } from "@/lib/constants/vivo"

function normalizeHash(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase()
}

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

export function usePartnerSync() {
  const pathname = usePathname()

  useEffect(() => {
    const session = getOrderSession()
    const cep = getCustomerCep()
    if (!cep) return

    const urlHash = getPartnerHashFromUrl()
    const storedHash = session?.partnerHash
    const hashChanged = normalizeHash(urlHash) !== normalizeHash(storedHash)
    const isLegacySession = session != null && storedHash == null

    if (session && !hashChanged && !isLegacySession) return

    let cancelled = false

    void (async () => {
      try {
        const partner = await resolvePartner(cep)
        if (cancelled) return

        if (partner?.partner_hash) {
          applyPartnerHashToUrl(partner.partner_hash)
        }

        const current = getOrderSession()
        if (current) {
          saveOrderSession({
            ...current,
            ...toPartnerSessionFields(partner),
          })

          await tryUpdateOrder({
            partner_id: partner?.partner_id ?? null,
            business_partner: partner?.partner_name ?? VIVO_COMPANY_NAME,
            category: VIVO_CATEGORY,
            landing_page: VIVO_LANDING_PAGE,
          })
        }
      } catch {
        // Keep the stored partner if the resolver is unavailable.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [pathname])
}
