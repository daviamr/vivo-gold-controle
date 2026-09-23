import type { Metadata } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import "./globals.css";
import AppShell from '../components/layout/AppShell'
import { openGraphImages, siteDescription, siteKeywords, siteTitle, twitterCard } from "@/lib/site-metadata"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["200", "300", "400","500" ,"600" ,"700"],
  variable: "--font-roboto"
});

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords: [...siteKeywords],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    images: [...openGraphImages],
  },
  twitter: twitterCard,
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="pt-br">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T32MMSCN');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`relative ${roboto.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T32MMSCN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {process.env.NODE_ENV === "production" && (
          <Script id="s3-index-fallback" strategy="beforeInteractive">
            {`(function(){var p=location.pathname;if(p==="/"||p==="/index.html")return;if(/\\.[a-zA-Z0-9]+$/.test(p))return;var known={pf:1,pj:1,"politica-de-privacidade":1,"termos-de-uso":1,editar:1,"editar-concluido":1,retomar:1};var parts=p.split("/").filter(Boolean);if(!parts.length||!known[parts[0]])return;var b=p.endsWith("/")?p:p+"/";location.replace(b+"index.html"+location.search+location.hash)})();`}
          </Script>
        )}
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
