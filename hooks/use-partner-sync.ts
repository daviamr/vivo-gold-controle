"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { applyPartnerHashToUrl, getPartnerHashFromUrl, getStoredPartnerHash } from "@/lib/partner-hash"
import { persistIncomingPartnerHash } from "@/lib/order-storage"
import { expireCheckoutFlowIfStale } from "@/lib/storage-expiry"

export function usePartnerSync() {
  const pathname = usePathname()

  useEffect(() => {
    expireCheckoutFlowIfStale()

    const isCompletedFlow =
      Boolean(pathname?.includes("/available")) ||
      Boolean(pathname?.includes("/unavailable"))

    if (isCompletedFlow) return

    const urlHash = getPartnerHashFromUrl()
    if (urlHash) {
      persistIncomingPartnerHash(urlHash)
      return
    }

    const storedHash = getStoredPartnerHash()
    if (storedHash) applyPartnerHashToUrl(storedHash)
  }, [pathname])
}
