/**
 * Prefixa caminhos de assets em `/public` com `basePath`.
 * Em `next export`, `next/image` + `unoptimized` costuma omitir esse prefixo no HTML.
 */
export function withBasePath(path: string): string {
  if (!path.startsWith('/')) return path
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  if (!base || base === '/') return path
  if (path === base || path.startsWith(`${base}/`)) return path
  return `${base}${path}`
}
