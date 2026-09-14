"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { resolvePartner } from "@/lib/api/partner-resolver"
import { getPartnerHashFromUrl, applyPartnerHashToUrl, isSamePartnerHash } from "@/lib/partner-hash"
import {
  getOrderSession,
  getPartnerSessionFields,
  savePartnerData,
} from "@/lib/order-storage"
import { tryUpdateOrder } from "@/lib/order-actions"
import { VIVO_CATEGORY, VIVO_COMPANY_NAME, VIVO_LANDING_PAGE } from "@/lib/constants/vivo"

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
    const stored = getPartnerSessionFields()
    const cep = getCustomerCep()
    const urlHash = getPartnerHashFromUrl()

    if (!cep && !urlHash) return

    const storedHash = stored.partnerHash
    const hashChanged = !isSamePartnerHash(urlHash, storedHash)
    const hasPartner = stored.partnerId != null && Boolean(stored.partnerLogoUrl || stored.partnerName)
    const isLegacySession = storedHash == null && hasPartner

    if (!hashChanged && !isLegacySession && hasPartner) return

    let cancelled = false

    void (async () => {
      try {
        const partner = await resolvePartner(cep)
        if (cancelled) return

        if (urlHash && !partner) return

        if (partner?.partner_hash) {
          applyPartnerHashToUrl(partner.partner_hash)
        }

        savePartnerData(partner)

        if (!partner || !session) return

        await tryUpdateOrder({
          partner_id: partner.partner_id,
          business_partner: partner.partner_name ?? VIVO_COMPANY_NAME,
          category: VIVO_CATEGORY,
          landing_page: VIVO_LANDING_PAGE,
        })
      } catch {
        // Keep the stored partner if the resolver is unavailable.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [pathname])
}
