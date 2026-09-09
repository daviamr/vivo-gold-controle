'use client'

import { useState } from "react"
import Image from "next/image"
import { withBasePath } from "@/lib/basePath"

type VivoLogoProps = {
  variant?: "header" | "modal"
  className?: string
}

export default function VivoLogo({ variant = "header", className }: VivoLogoProps) {
  const primary = variant === "modal" ? "/logo-vivo-modal.png" : "/logo-vivo-header.png"
  const [src, setSrc] = useState(primary)

  return (
    <Image
      src={withBasePath(src)}
      alt="Vivo Parceiro Autorizado"
      width={variant === "modal" ? 103 : 100}
      height={variant === "header" ? 39 : 40}
      className={className ?? (variant === "header" ? "w-[100px] h-[39px] object-contain" : "max-w-[103px] object-contain")}
      onError={() => {
        if (src !== "/logo-vivo.webp") setSrc("/logo-vivo.webp")
      }}
    />
  )
}
