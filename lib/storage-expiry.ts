import { clearCheckoutFlow, clearCompletedPartnerFlow, FLOW_TIMESTAMP_KEY } from "@/lib/clear-checkout-flow"

const FLOW_TTL_MS = 24 * 60 * 60 * 1000

export function touchFlowTimestamp() {
  try {
    localStorage.setItem(FLOW_TIMESTAMP_KEY, String(Date.now()))
  } catch {
    // localStorage unavailable
  }
}

export function expireCheckoutFlowIfStale() {
  try {
    const raw = localStorage.getItem(FLOW_TIMESTAMP_KEY)
    if (!raw) return false

    const timestamp = Number(raw)
    if (Number.isNaN(timestamp) || Date.now() - timestamp > FLOW_TTL_MS) {
      clearCheckoutFlow()
      clearCompletedPartnerFlow()
      return true
    }
  } catch {
    // storage unavailable
  }

  return false
}
