import { clearOrderSession, clearPartnerSession } from "@/lib/order-storage"

export const CUSTOMER_STORAGE_KEY = "customer"
export const KEEP_CUSTOMER_AFTER_RESUME_KEY = "keep-customer-after-resume"
export const FLOW_TIMESTAMP_KEY = "vivo-controle-flow-timestamp"

export function clearCheckoutFlow() {
  try {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY)
    clearOrderSession()
  } catch {
    // localStorage unavailable
  }
}

export function clearCompletedPartnerFlow() {
  try {
    clearPartnerSession()
    localStorage.removeItem(FLOW_TIMESTAMP_KEY)
  } catch {
    // localStorage unavailable
  }
}

export function markKeepCustomerAfterResume() {
  try {
    sessionStorage.setItem(KEEP_CUSTOMER_AFTER_RESUME_KEY, "1")
  } catch {
    // sessionStorage unavailable
  }
}

export function consumeKeepCustomerAfterResume(): boolean {
  try {
    const keep = sessionStorage.getItem(KEEP_CUSTOMER_AFTER_RESUME_KEY) === "1"
    if (keep) sessionStorage.removeItem(KEEP_CUSTOMER_AFTER_RESUME_KEY)
    return keep
  } catch {
    return false
  }
}
