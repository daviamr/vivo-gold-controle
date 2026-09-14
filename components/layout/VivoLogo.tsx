type VivoLogoProps = {
  variant?: "header" | "modal"
  className?: string
}

export default function VivoLogo({ variant = "header", className }: VivoLogoProps) {
  if (variant === "modal") {
    return (
      <img
        src="/logo-vivo-modal.png"
        alt="Vivo Parceiro Autorizado"
        className={className ?? "max-w-[103px] object-contain"}
      />
    )
  }

  return (
    <img
      src="/logo-vivo-header.png"
      alt="Vivo Parceiro Autorizado"
      className={className ?? "w-[100px] h-[39px] object-contain"}
    />
  )
}
