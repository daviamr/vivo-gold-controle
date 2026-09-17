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

const ORDER_SESSION_KEY = "vivo-order-session"
const PARTNER_SESSION_KEY = "vivo-partner-session"

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

export function getStoredPartnerHash(): string | null {
  if (typeof window === "undefined") return null

  try {
    const sessionRaw = localStorage.getItem(ORDER_SESSION_KEY)
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw) as { partnerHash?: string | null }
      if (typeof session?.partnerHash === "string" && session.partnerHash.trim()) {
        return session.partnerHash
      }
    }

    const partnerRaw = localStorage.getItem(PARTNER_SESSION_KEY)
    if (partnerRaw) {
      const stored = JSON.parse(partnerRaw) as { partnerHash?: string | null }
      if (typeof stored?.partnerHash === "string" && stored.partnerHash.trim()) {
        return stored.partnerHash
      }
    }
  } catch {
    return null
  }

  return null
}

export function getResolvedPartnerHash(pathname?: string) {
  return getPartnerHashFromUrl(pathname) ?? getStoredPartnerHash()
}

export function isSamePartnerHash(
  left: string | null | undefined,
  right: string | null | undefined,
) {
  return normalizeHash(left) === normalizeHash(right)
}

export function withPartnerPath(path: string, pathname?: string) {
  const [pathAndQuery, fragment = ""] = path.split("#")
  const [rawPath, query = ""] = pathAndQuery.split("?")
  const clean = rawPath.startsWith("/") ? rawPath : `/${rawPath}`
  const partnerHash = getResolvedPartnerHash(pathname)
  const querySuffix = pathAndQuery.includes("?") ? `?${query}` : ""
  const hashSuffix = path.includes("#") ? `#${fragment}` : ""

  if (!partnerHash) return `${clean}${querySuffix}${hashSuffix}`
  if (clean === "/") return `/${partnerHash}${querySuffix}${hashSuffix}`

  return `/${partnerHash}${clean}${querySuffix}${hashSuffix}`
}

export function applyPartnerHashToUrl(partnerHash: string) {
  if (typeof window === "undefined" || !partnerHash || getPartnerHashFromUrl()) return

  const { search, hash } = window.location
  const pathname = normalizePathname()
  const nextPath = pathname === "/" ? `/${partnerHash}` : `/${partnerHash}${pathname}`
  window.history.replaceState(null, "", `${nextPath}${search}${hash}`)
  window.dispatchEvent(new Event("vivo-partner-hash-changed"))
}

export function pushWithPartnerPath(
  router: { push: (href: string) => void | Promise<boolean | void> },
  path: string,
) {
  const partnerHash = getResolvedPartnerHash()
  const result = router.push(path)
  const restoreHash = () => {
    if (!partnerHash) return
    applyPartnerHashToUrl(partnerHash)
    window.setTimeout(() => applyPartnerHashToUrl(partnerHash), 0)
  }

  if (result && typeof (result as Promise<unknown>).then === "function") {
    void Promise.resolve(result).finally(restoreHash)
    return
  }

  restoreHash()
}
