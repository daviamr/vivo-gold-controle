export const VIVO_COMPANY_ID = 9
export const VIVO_COMPANY_NAME = "Vivo"
export const VIVO_CATEGORY = "movel"
export const VIVO_LANDING_PAGE = "controle"
export const VIVO_CLIENT_TYPE = "PF" as const
export const VIVO_JOURNEY = ["vivo"] as const

export type VivoClientType = "PF" | "PJ"

export function getVivoClientType(pathname?: string): VivoClientType {
  const path = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "")
  const segments = path.split("/").filter(Boolean)
  if (segments.includes("pj")) return "PJ"
  return VIVO_CLIENT_TYPE
}
