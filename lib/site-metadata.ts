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
