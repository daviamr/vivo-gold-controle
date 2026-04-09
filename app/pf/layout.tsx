import type { Metadata } from "next";
import Header from '../../components/layout/Header'
import DefaultLayout from '../../components/layout/DefaultLayout'

export const metadata: Metadata = {
  title: 'Vivo Fibra - A Melhor Internet Banda Larga da América Latina',
  description: 'A Melhor Internet Banda Larga da América Latina',
  icons: '/favicon.ico'
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
