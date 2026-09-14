"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { getPartnerSessionFields, ORDER_SESSION_EVENT } from "@/lib/order-storage"

type PartnerSession = {
  partnerId: number | null
  partnerName: string | null
  partnerLogoUrl: string | null
  partnerCnpj: string | null
}

function readPartnerSession(): PartnerSession {
  const stored = getPartnerSessionFields()
  return {
    partnerId: stored.partnerId,
    partnerName: stored.partnerName,
    partnerLogoUrl: stored.partnerLogoUrl,
    partnerCnpj: stored.partnerCnpj ?? null,
  }
}

export function usePartner() {
  const pathname = usePathname()
  const [partner, setPartner] = useState<PartnerSession>(readPartnerSession)

  useEffect(() => {
    const sync = () => setPartner(readPartnerSession())

    sync()
    window.addEventListener(ORDER_SESSION_EVENT, sync)
    window.addEventListener("vivo-partner-hash-changed", sync)
    window.addEventListener("storage", sync)

    return () => {
      window.removeEventListener(ORDER_SESSION_EVENT, sync)
      window.removeEventListener("vivo-partner-hash-changed", sync)
      window.removeEventListener("storage", sync)
    }
  }, [pathname])

  return partner
}

export function usePartnerId() {
  return usePartner().partnerId
}
