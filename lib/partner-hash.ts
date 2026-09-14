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
  "index.html",
  "_next",
])

function normalizeHash(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase()
}

function normalizePathname(pathname?: string) {
  const path = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "")
  return path.replace(/\/index\.html$/i, "") || "/"
}

export function getPartnerHashFromUrl(pathname?: string) {
  const path = normalizePathname(pathname)
  const segment = path.replace(/^\//, "").split("/")[0]

  if (!segment || IGNORED_PATH_SEGMENTS.has(segment) || /\.[a-zA-Z0-9]+$/.test(segment)) {
    return null
  }

  return segment
}

export function isSamePartnerHash(
  left: string | null | undefined,
  right: string | null | undefined,
) {
  return normalizeHash(left) === normalizeHash(right)
}

export function withPartnerPath(path: string, pathname?: string) {
  const clean = path.startsWith("/") ? path : `/${path}`
  const hash = getPartnerHashFromUrl(pathname)

  if (!hash) return clean
  if (clean === "/") return `/${hash}`

  return `/${hash}${clean}`
}

export function applyPartnerHashToUrl(partnerHash: string) {
  if (typeof window === "undefined" || !partnerHash || getPartnerHashFromUrl()) return

  const { search, hash } = window.location
  const pathname = normalizePathname()
  const nextPath = pathname === "/" ? `/${partnerHash}` : `/${partnerHash}${pathname}`
  window.history.replaceState(null, "", `${nextPath}${search}${hash}`)
  window.dispatchEvent(new Event("vivo-partner-hash-changed"))
}
