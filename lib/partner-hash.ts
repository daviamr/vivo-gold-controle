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
const CONSULTANT_HASH_KEY = "vivo-gold-consultant-hash"
const CONSULTANT_PARTNER_KEY = "vivo-gold-consultant-partner-hash"

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

function pathSegments(pathname?: string) {
  return normalizePathname(pathname).replace(/^\//, "").split("/").filter(Boolean)
}

function readSession(key: string) {
  if (typeof window === "undefined") return null
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSession(key: string, value: string) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // sessionStorage unavailable
  }
}

export function getConsultantHashFromUrl(pathname?: string) {
  const segments = pathSegments(pathname)
  const partnerHash = segments[0]
  const consultantHash = segments[1]

  if (!partnerHash || IGNORED_PATH_SEGMENTS.has(partnerHash.toLowerCase()) || /\.[a-zA-Z0-9]+$/.test(partnerHash)) {
    return null
  }

  if (!consultantHash || IGNORED_PATH_SEGMENTS.has(consultantHash.toLowerCase()) || /\.[a-zA-Z0-9]+$/.test(consultantHash)) {
    return null
  }

  return consultantHash
}

export function clearConsultantHash() {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(CONSULTANT_HASH_KEY)
    sessionStorage.removeItem(CONSULTANT_PARTNER_KEY)
  } catch {
    // sessionStorage unavailable
  }
}

export function captureConsultantHash(pathname?: string) {
  const partnerHash = getPartnerHashFromUrl(pathname)
  const consultantHash = getConsultantHashFromUrl(pathname)

  if (partnerHash && consultantHash) {
    writeSession(CONSULTANT_HASH_KEY, consultantHash)
    writeSession(CONSULTANT_PARTNER_KEY, partnerHash)
    return
  }

  if (!partnerHash) return

  const storedPartner = readSession(CONSULTANT_PARTNER_KEY)
  if (storedPartner && !isSamePartnerHash(storedPartner, partnerHash)) {
    clearConsultantHash()
  }
}

export function rememberConsultantHash(hash: string, partnerHash: string | null) {
  const value = hash.trim()
  if (!value) return

  writeSession(CONSULTANT_HASH_KEY, value)
  if (partnerHash) {
    writeSession(CONSULTANT_PARTNER_KEY, partnerHash)
  }
}

export function consultantHashFromPartial(order: { responsible_consultant?: unknown } | null | undefined) {
  const consultant = order?.responsible_consultant
  if (!consultant || typeof consultant !== "object") return null

  const hash = (consultant as { hash?: unknown }).hash
  if (typeof hash !== "string" || !hash.trim()) return null

  return { hash: hash.trim() }
}

export function adoptConsultantHashFromOrder(
  consultant: { hash?: string | null } | null | undefined,
  partnerHash: string | null,
) {
  captureConsultantHash()
  if (getConsultantHashFromUrl()) return
  if (!consultant?.hash) return

  rememberConsultantHash(consultant.hash, partnerHash)
}

export function getStoredConsultantHash() {
  captureConsultantHash()
  return readSession(CONSULTANT_HASH_KEY)
}

export function getConsultantHashForPartner(partnerHash: string | null | undefined) {
  if (!partnerHash) return null

  captureConsultantHash()

  const hash = readSession(CONSULTANT_HASH_KEY)
  const storedPartner = readSession(CONSULTANT_PARTNER_KEY)
  if (!hash || !storedPartner || !isSamePartnerHash(storedPartner, partnerHash)) {
    return null
  }

  return hash
}

function partnerPrefix(partnerHash: string) {
  const consultantHash = getConsultantHashForPartner(partnerHash)
  return consultantHash ? `/${partnerHash}/${consultantHash}` : `/${partnerHash}`
}

export function withPartnerPath(path: string, pathname?: string) {
  const [pathAndQuery, fragment = ""] = path.split("#")
  const [rawPath, query = ""] = pathAndQuery.split("?")
  const clean = rawPath.startsWith("/") ? rawPath : `/${rawPath}`
  const partnerHash = getResolvedPartnerHash(pathname)
  const querySuffix = pathAndQuery.includes("?") ? `?${query}` : ""
  const hashSuffix = path.includes("#") ? `#${fragment}` : ""

  if (!partnerHash) return `${clean}${querySuffix}${hashSuffix}`

  const prefix = partnerPrefix(partnerHash)
  if (clean === "/") return `${prefix}${querySuffix}${hashSuffix}`

  return `${prefix}${clean}${querySuffix}${hashSuffix}`
}

export function applyPartnerHashToUrl(partnerHash: string) {
  if (typeof window === "undefined" || !partnerHash || getPartnerHashFromUrl()) return

  const { search, hash } = window.location
  const pathname = normalizePathname()
  const prefix = partnerPrefix(partnerHash)
  const nextPath = pathname === "/" ? prefix : `${prefix}${pathname}`
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
