import type { Metadata } from "next";
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
      <body className={`${roboto.variable} font-sans antialiased`}>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
