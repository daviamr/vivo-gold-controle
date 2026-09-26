'use client'

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Footer from "./Footer"
import TalkToUs from "../talk-to-us/TalkToUs"
import { usePartnerSync } from "@/hooks/use-partner-sync"
import Bubble from "../bubble/Bubble"

const HIDDEN_FOOTER_PATHS = ["/checkout", "/available", "/editar-concluido"]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTalkToUsOpen, setIsTalkToUsOpen] = useState(false)
  const hideFooter = HIDDEN_FOOTER_PATHS.some((path) => pathname?.includes(path))

  usePartnerSync()

  useEffect(() => {
    setIsTalkToUsOpen(false)
  }, [pathname])

  return (
    <>
      {isTalkToUsOpen && <TalkToUs setIsTalkToUsOpen={setIsTalkToUsOpen} />}
      {!hideFooter && <Bubble onTalkToUs={() => setIsTalkToUsOpen(true)} />}
      {children}
      {!hideFooter && <Footer setIsTalkToUsOpen={setIsTalkToUsOpen} />}
    </>
  )
}
