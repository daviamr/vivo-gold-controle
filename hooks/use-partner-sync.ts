"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { resolvePartner } from "@/lib/api/partner-resolver"
import { applyPartnerHashToUrl, captureConsultantHash, getPartnerHashFromUrl, getStoredPartnerHash } from "@/lib/partner-hash"
import { isPartnerResolved, saveResolvedPartner } from "@/lib/order-storage"
import { expireCheckoutFlowIfStale } from "@/lib/storage-expiry"

let pendingResolve: Promise<void> | null = null

function resolvePartnerOnLoad(urlHash: string | null) {
  if (pendingResolve) return pendingResolve

  pendingResolve = resolvePartner(urlHash ? { partnerHash: urlHash } : {})
    .then((partner) => {
      saveResolvedPartner(partner, urlHash)
      if (partner?.partner_hash) applyPartnerHashToUrl(partner.partner_hash)
    })
    .catch(() => {
      pendingResolve = null
    })

  return pendingResolve
}

export function usePartnerSync() {
  const pathname = usePathname()

  useEffect(() => {
    expireCheckoutFlowIfStale()
    captureConsultantHash()

    const skipResolver =
      Boolean(pathname?.includes("/available")) ||
      Boolean(pathname?.includes("/unavailable")) ||
      Boolean(pathname?.includes("/editar")) ||
      Boolean(pathname?.includes("/retomar"))

    if (skipResolver) return

    const urlHash = getPartnerHashFromUrl()
    if (!isPartnerResolved()) {
      void resolvePartnerOnLoad(urlHash)
      return
    }

    if (urlHash) return

    const storedHash = getStoredPartnerHash()
    if (storedHash) applyPartnerHashToUrl(storedHash)
  }, [pathname])
}
