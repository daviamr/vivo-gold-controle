import type { Metadata } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import "./globals.css";
import AppShell from '../components/layout/AppShell'
import { openGraphImages, twitterCard } from "@/lib/site-metadata"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["200", "300", "400","500" ,"600" ,"700"],
  variable: "--font-roboto"
});

export const metadata: Metadata = {
  title: "Vivo Fibra",
  description: "A Melhor Internet Banda Larga da América Latina",
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
      <body className={`relative ${roboto.variable} font-sans antialiased`}>
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
