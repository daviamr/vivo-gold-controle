import Header from "@/components/layout/Header"
import DefaultLayout from "@/components/layout/DefaultLayout"

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <DefaultLayout>
        {children}
      </DefaultLayout>
    </>
  )
}
