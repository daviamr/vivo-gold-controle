'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { withPartnerPath } from "@/lib/partner-hash"

function Index({ isOpen = true }: MenuMobileProps) {
  const [pfHref, setPfHref] = useState("/pf")

  useEffect(() => {
    const sync = () => setPfHref(withPartnerPath("/pf"))
    sync()
    window.addEventListener("vivo-partner-hash-changed", sync)
    return () => window.removeEventListener("vivo-partner-hash-changed", sync)
  }, [])

  return (
    <div className={`flex flex-col duration-300 h-0 overflow-hidden ${isOpen ? 'h-12 px-2 my-2' : ''}`}>
      <Link href={pfHref}
        className={`cursor-pointer duration-300 hover:text-default-purple font-bold text-default-purple`}>
        Para Você
      </Link>
    </div>
  )
}

type MenuMobileProps = {
  isOpen: boolean,
}

export default Index
