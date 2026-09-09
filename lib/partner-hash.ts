const IGNORED_PATH_SEGMENTS = new Set([
  "pf",
  "pj",
  "checkout",
  "available",
  "unavailable",
  "editar",
  "editar-concluido",
  "retomar",
  "politica-de-privacidade",
  "termos-de-uso",
])

export function getPartnerHashFromUrl(pathname?: string) {
  const path = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "")
  const segment = path.replace(/^\//, "").split("/")[0]

  if (!segment || IGNORED_PATH_SEGMENTS.has(segment)) {
    return null
  }

  return segment
}

export function withPartnerPath(path: string, pathname?: string) {
  const clean = path.startsWith("/") ? path : `/${path}`
  const hash = getPartnerHashFromUrl(pathname)
  return hash ? `/${hash}${clean}` : clean
}

export function applyPartnerHashToUrl(partnerHash: string) {
  if (typeof window === "undefined" || !partnerHash || getPartnerHashFromUrl()) return

  const { pathname, search, hash } = window.location
  const nextPath = pathname === "/" ? `/${partnerHash}` : `/${partnerHash}${pathname}`
  window.history.replaceState(null, "", `${nextPath}${search}${hash}`)
  window.dispatchEvent(new Event("vivo-partner-hash-changed"))
}
