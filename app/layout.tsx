import type { Metadata } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from '../components/layout/Footer'

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["200", "300", "400","500" ,"600" ,"700"],
  variable: "--font-roboto"
});

export const metadata: Metadata = {
  title: "Vivo Fibra",
  description: "A Melhor Internet Banda Larga da América Latina",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="pt-br">
      <body className={`relative ${roboto.variable} font-sans antialiased`}>
        <Script id="s3-index-fallback" strategy="beforeInteractive">
          {`(function(){var p=location.pathname;if(p==="/"||p==="/index.html")return;if(/\\.[a-zA-Z0-9]+$/.test(p))return;var b=p.endsWith("/")?p:p+"/";location.replace(b+"index.html"+location.search+location.hash)})();`}
        </Script>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
