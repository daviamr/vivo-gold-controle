'use client'
import { Menu } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import MenuMobile from '../menu-mobile/MenuMobile'

function Index() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white py-3 shadow-md lg:py-2">
      <div className="container m-auto px-4">

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Image src={'/logo-vivo.webp'} alt='Logo VivoFibra' width={128} height={48} />

            <div className="hidden ml-6 items-center gap-6 lg:flex">
              <Link href={'/pf'}
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

          <div className="hidden lg:flex flex-col items-center">
            <Image src={'/logo-gold.webp'} alt="Logo Gold" width={112} height={60}/>
            <p className="border border-[#6c4598] px-[5px] rounded-sm text-[#6c4598] font-semibold text-sm">Parceiro autorizado</p>
          </div>
        </div>

        <MenuMobile isOpen={isOpen} />
      </div>
    </header>
  )
}

export default Index