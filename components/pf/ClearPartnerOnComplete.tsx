"use client"

import { useEffect } from "react"
import { clearCompletedPartnerFlow } from "@/lib/clear-checkout-flow"

export function ClearPartnerOnComplete() {
  useEffect(() => {
    clearCompletedPartnerFlow()
  }, [])

  return null
}
