'use client'

import { useEffect } from "react"

const CUSTOMER_STORAGE_KEY = "customer"

export function ClearCustomerStorageOnPfHome() {
  useEffect(() => {
    try {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY)
    } catch {
      console.log('Error clearing customer storage')
    }
  }, [])
  return null
}
