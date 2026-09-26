import type { Metadata } from "next";
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
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){var p=location.pathname;if(p==="/"||p==="/index.html")return;if(/\\.[a-zA-Z0-9]+$/.test(p))return;var known={pf:1,pj:1,"politica-de-privacidade":1,"termos-de-uso":1,editar:1,"editar-concluido":1,retomar:1};var parts=p.split("/").filter(Boolean);var n=0;while(n<2&&parts.length&&!known[parts[0]]&&parts[0]!=="index.html"&&parts[0]!=="_next"){parts=parts.slice(1);n++}if(!parts.length||!known[parts[0]])return;var path="/"+parts.join("/");if(!path.endsWith("/"))path+="/";location.replace(path+"index.html"+location.search+location.hash)})();`,
            }}
          />
        )}
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
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
