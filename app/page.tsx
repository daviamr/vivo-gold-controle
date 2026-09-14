import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import DefaultLayout from "@/components/layout/DefaultLayout"
import PfHome from "@/components/pf/PfHome"
import { openGraphImages, twitterCard } from "@/lib/site-metadata"

export const metadata: Metadata = {
  title: "Vivo Fibra - A Melhor Internet Banda Larga da América Latina",
  description: "A Melhor Internet Banda Larga da América Latina",
  icons: "/favicon.ico",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    images: [...openGraphImages],
  },
  twitter: twitterCard,
}

export default function Home() {
  return (
    <>
      <Header />
      <DefaultLayout>
        <PfHome />
      </DefaultLayout>
    </>
  )
}
