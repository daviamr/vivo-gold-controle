import Image from "next/image"

function Index() {
  return (
    <div className="relative w-full bottom-0 bg-white">
      <div className="container m-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Image src={`/icon-f-1.svg`} alt="logo" width={120} height={40} />
          <Image src={`/icon-f-2.svg`} alt="logo" width={80} height={40} />
          <Image src={`/icon-f-3.png`} alt="logo" width={120} height={40} />
        </div>
        <div className="flex flex-col justify-center items-center gap-2 tracking-wide">
          <span>Telefônica Brasil S.A CNPJ 02.558.157/0001-62. Copyright 2026. @Vivo. Todos os direitos reservados.</span>
          <span>Endereço: Av. Engenheiro Luis Carlos Berrini, 1376 - Cidade Monções, São Paulo, SP, Brasil, CEP: 04.571-936</span>
        </div>
      </div>
    </div>
  )
}

export default Index
