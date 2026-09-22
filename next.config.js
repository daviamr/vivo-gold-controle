const path = require('path')

/** @type {import('next').NextConfig} */
/** Caminho público onde o site é servido. Vazio = raiz do bucket/domínio. */
const basePath = ''

const partnerRewrites = [
  { source: '/:partnerHash/:consultantHash/pf/:path*', destination: '/pf/:path*' },
  { source: '/:partnerHash/pf/:path*', destination: '/pf/:path*' },
  { source: '/:partnerHash/:consultantHash/politica-de-privacidade/:path*', destination: '/politica-de-privacidade/:path*' },
  { source: '/:partnerHash/politica-de-privacidade/:path*', destination: '/politica-de-privacidade/:path*' },
  { source: '/:partnerHash/:consultantHash/termos-de-uso/:path*', destination: '/termos-de-uso/:path*' },
  { source: '/:partnerHash/termos-de-uso/:path*', destination: '/termos-de-uso/:path*' },
  { source: '/:partnerHash/:consultantHash/editar-concluido/:path*', destination: '/editar-concluido/:path*' },
  { source: '/:partnerHash/editar-concluido/:path*', destination: '/editar-concluido/:path*' },
  { source: '/:partnerHash/:consultantHash/editar/:path*', destination: '/editar/:path*' },
  { source: '/:partnerHash/editar/:path*', destination: '/editar/:path*' },
  { source: '/:partnerHash/:consultantHash/retomar/:path*', destination: '/retomar/:path*' },
  { source: '/:partnerHash/retomar/:path*', destination: '/retomar/:path*' },
  { source: '/:partnerHash/:consultantHash', destination: '/' },
  { source: '/:partnerHash', destination: '/' },
]

const nextConfig = {
  output: 'export',
  ...(basePath ? { basePath } : {}),
  trailingSlash: true, // importante para S3
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  env: {
    /** Usado pelo client para prefixar `/public`; o export não aplica basePath nos `src` de `next/image`. */
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true, // S3 não processa imagens
  },
}

if (process.env.NODE_ENV === 'development') {
  nextConfig.rewrites = async () => ({
    afterFiles: [
      { source: '/index.html', destination: '/' },
      { source: '/:path*/index.html', destination: '/:path*' },
      ...partnerRewrites,
    ],
  })
}

module.exports = nextConfig
