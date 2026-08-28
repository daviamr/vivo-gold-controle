'use client'

import { useEffect } from "react"
import { consumeKeepCustomerAfterResume, CUSTOMER_STORAGE_KEY } from "@/lib/clear-checkout-flow"

export function ClearCustomerStorageOnPfHome() {
  useEffect(() => {
    try {
      if (consumeKeepCustomerAfterResume()) return
      localStorage.removeItem(CUSTOMER_STORAGE_KEY)
    } catch {
      console.log('Error clearing customer storage')
    }
  }, [])
  return null
}
