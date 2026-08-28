"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getOrderByToken } from "@/lib/api/orders"
import {
  clearCheckoutFlow,
  CUSTOMER_STORAGE_KEY,
  markKeepCustomerAfterResume,
} from "@/lib/clear-checkout-flow"
import { hydrateCustomer } from "@/lib/second-call-mappers"

export default function ResumePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [fetchError, setFetchError] = useState<string | null>(null)
  const error = token ? fetchError : "Token inválido ou ausente."

  useEffect(() => {
    if (!token) return

    getOrderByToken(token)
      .then((data) => {
        clearCheckoutFlow()

        const customer = hydrateCustomer(data.partial_data, data.order_id)
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer))
        markKeepCustomerAfterResume()

        const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
        window.location.replace(`${base || ""}/#card-section`)
      })
      .catch(() => {
        setFetchError("Não foi possível retomar o pedido. Verifique o link e tente novamente.")
      })
  }, [token])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-600 text-center max-w-xs">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-sm text-[#525252]">Carregando seu pedido...</p>
    </div>
  )
}
