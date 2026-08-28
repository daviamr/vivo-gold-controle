/** @type {import('next').NextConfig} */
/** Caminho público onde o site é servido. Vazio = raiz do bucket/domínio. */
const basePath = ''

const nextConfig = {
  output: 'export',
  ...(basePath ? { basePath } : {}),
  trailingSlash: true, // importante para S3
  env: {
    /** Usado pelo client para prefixar `/public`; o export não aplica basePath nos `src` de `next/image`. */
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true, // S3 não processa imagens
  },
}

module.exports = nextConfig
