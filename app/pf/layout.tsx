import type { Metadata } from "next";
import Header from '../../components/layout/Header'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { openGraphImages, siteDescription, siteKeywords, siteTitle, twitterCard } from "@/lib/site-metadata"

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords: [...siteKeywords],
  icons: '/favicon.ico',
  openGraph: {
    type: "website",
    locale: "pt_BR",
    images: [...openGraphImages],
  },
  twitter: twitterCard,
};

export default function PfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <DefaultLayout>
        {children}
      </DefaultLayout>
    </>
  )
}
