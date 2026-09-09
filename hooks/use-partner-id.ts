"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { getOrderSession, ORDER_SESSION_EVENT } from "@/lib/order-storage"

type PartnerSession = {
  partnerId: number | null
  partnerName: string | null
  partnerLogoUrl: string | null
  partnerCnpj: string | null
}

function readPartnerSession(): PartnerSession {
  const session = getOrderSession()
  return {
    partnerId: session?.partnerId ?? null,
    partnerName: session?.partnerName ?? null,
    partnerLogoUrl: session?.partnerLogoUrl ?? null,
    partnerCnpj: session?.partnerCnpj ?? null,
  }
}

export function usePartner() {
  const pathname = usePathname()
  const [partner, setPartner] = useState<PartnerSession>(readPartnerSession)

  useEffect(() => {
    const sync = () => setPartner(readPartnerSession())

    sync()
    window.addEventListener(ORDER_SESSION_EVENT, sync)
    window.addEventListener("storage", sync)

    return () => {
      window.removeEventListener(ORDER_SESSION_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [pathname])

  return partner
}

export function usePartnerId() {
  return usePartner().partnerId
}
