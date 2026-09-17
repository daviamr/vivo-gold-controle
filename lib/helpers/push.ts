import { withPartnerPath } from "@/lib/partner-hash"

export const setStepQuery = (nextStep: number) => {
  window.history.pushState(
    null,
    "",
    withPartnerPath(`/pf/checkout?step=${nextStep}`),
  )
}
