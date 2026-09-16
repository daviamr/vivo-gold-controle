'use client'
import { Menu } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { withPartnerPath } from "@/lib/partner-hash"
import MenuMobile from '../menu-mobile/MenuMobile'
import VivoLogo from "./VivoLogo"

function Index() {
  const [isOpen, setIsOpen] = useState(false)
  const [pfHref, setPfHref] = useState("/pf")

  useEffect(() => {
    const sync = () => setPfHref(withPartnerPath("/pf"))
    sync()
    window.addEventListener("vivo-partner-hash-changed", sync)
    return () => window.removeEventListener("vivo-partner-hash-changed", sync)
  }, [])

  return (
    <header className="bg-white py-4">
      <div className="container m-auto px-4">

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <VivoLogo />

            <div className="hidden ml-6 items-center gap-6 lg:flex">
              <Link href={pfHref}
                className={`cursor-pointer duration-300 hover:text-default-purple font-bold text-default-purple`}>
                Para Você
              </Link>
            </div>
          </div>

          <button
            className="cursor-pointer border rounded-sm p-2 lg:hidden"
            onClick={() => setIsOpen((prev => !prev))}>
            <Menu size={32} />
          </button>
        </div>

        <MenuMobile isOpen={isOpen} />
      </div>
    </header>
  )
}

export default Index
