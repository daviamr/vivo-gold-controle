export const siteTitle = "Vivo Controle | Plano de Celular com Valor Fixo e Rede 5G"

export const siteDescription =
  "Plano Vivo Controle com valor fixo todo mês: ligações e SMS para qualquer operadora do Brasil, acesso à rede 5G, Vivo Valoriza e bônus de internet na portabilidade. Contrate online."

export const siteKeywords = [
  "Vivo Controle",
  "plano controle Vivo",
  "plano de celular valor fixo",
  "plano Vivo 5G",
  "portabilidade Vivo",
  "Vivo Valoriza",
]

const OG_IMAGE_PATH = "https://controle.vivo.ad/og-image.jpeg"

export const openGraphImages = [
  {
    url: OG_IMAGE_PATH,
    width: 1200,
    height: 630,
    alt: "Vivo Controle",
  },
] as const

export const twitterCard = {
  card: "summary_large_image" as const,
  images: [OG_IMAGE_PATH],
}
