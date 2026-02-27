import Image from "next/image"
import Link from "next/link"

function Index({ isOpen = true }: MenuMobileProps) {
  return (
    <div className={`flex flex-col duration-300 h-0 overflow-hidden ${isOpen ? 'h-27 px-2 my-2' : ''}`}>
      <Link href={'/pf'}
        className={`cursor-pointer duration-300 hover:text-default-purple font-bold text-default-purple`}>
        Para Você
      </Link>

      <div className="flex items-start">
        <div className="flex flex-col items-center">
          <Image src={'/logo-gold.webp'} alt="Logo Gold" width={112} height={60} />
          <p className="border border-[#6c4598] px-[5px] rounded-sm text-[#6c4598] font-semibold text-sm">Parceiro autorizado</p>
        </div>
      </div>
    </div>
  )
}

type MenuMobileProps = {
  isOpen: boolean,
}

export default Index