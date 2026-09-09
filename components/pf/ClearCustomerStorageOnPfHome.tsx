'use client'

import { useEffect } from "react"
import { clearCheckoutFlow, consumeKeepCustomerAfterResume } from "@/lib/clear-checkout-flow"

export function ClearCustomerStorageOnPfHome() {
  useEffect(() => {
    try {
      if (consumeKeepCustomerAfterResume()) return
      clearCheckoutFlow()
    } catch {
      console.log('Error clearing customer storage')
    }
  }, [])
  return null
}
