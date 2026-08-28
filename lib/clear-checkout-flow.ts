export const CUSTOMER_STORAGE_KEY = "customer"
export const KEEP_CUSTOMER_AFTER_RESUME_KEY = "keep-customer-after-resume"

export function clearCheckoutFlow() {
  try {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY)
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
