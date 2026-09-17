'use client'

import { Copyright } from "lucide-react"
import { formatCnpj } from "@/lib/cnpj"
import { usePartner } from "@/hooks/use-partner-id"
import { pushWithPartnerPath } from "@/lib/partner-hash"
import { useRouter } from "next/navigation"
import VivoLogo from "./VivoLogo"

export default function Footer({ setIsTalkToUsOpen }: { setIsTalkToUsOpen: (isOpen: boolean) => void }) {
  const router = useRouter()
  const { partnerName, partnerLogoUrl, partnerCnpj } = usePartner()
  const formattedCnpj = partnerCnpj ? formatCnpj(partnerCnpj) : null

  return (
    <footer className="bg-white">
      <div className="py-6 bg-[#3F3F3F]">
        <div className="container max-w-7xl mx-auto px-4">
          <nav className="text-center md:text-left flex flex-wrap gap-2 items-center justify-center sm:gap-8 text-white">
            <a href="#" className="flex items-center gap-2 min-w-80 md:min-w-auto"><Copyright /> 2026 - Todos os direitos reservados</a>
            <p className="min-w-80 md:min-w-auto cursor-pointer" onClick={() => pushWithPartnerPath(router, "/politica-de-privacidade")}>Política de Privacidade</p>
            <p className="min-w-80 md:min-w-auto cursor-pointer" onClick={() => setIsTalkToUsOpen(true)}>Fale Conosco</p>
          </nav>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-1">
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-32">
          <div className="flex items-center gap-8">
            <VivoLogo className="my-4 w-[100px] h-[39px] object-contain" />

            {partnerLogoUrl && (
              <img
                className="my-4 w-auto h-[39px]"
                src={partnerLogoUrl}
                alt={partnerName ?? "Parceiro"}
              />
            )}
          </div>

          {(partnerName || formattedCnpj) && (
            <p className="text-xs text-center max-w-120 text-[#747474]">
              {partnerName && `${partnerName} - Parceiro Vivo Empresa`}
              {partnerName && formattedCnpj && <br />}
              {formattedCnpj}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
