import Image from "next/image"

function Index() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Image src="/icon-1.svg" alt="Benefit 1" width={100} height={100} className="mb-4" />
        <div>
          <p className="mb-2">Ligações e SMS inclusos</p>
          <p className="max-w-100 opacity-75">Faça ligações e mande SMS para qualquer operadora do Brasil.</p>
        </div>
      </div>

      <div>
        <Image src="/icon-f-4.svg" alt="Benefit 1" width={100} height={100} className="mb-4" />
        <div>
          <p className="mb-2">Vivo Valoriza</p>
          <p className="max-w-100 opacity-75">Aproveite descontos e gratuidades em produtos, serviços e experiências.</p>
        </div>
      </div>

      <div>
        <Image src="/icon-2.svg" alt="Benefit 1" width={100} height={100} className="mb-4" />
        <div>
          <p className="mb-2">Acesso à rede 5G da Vivo</p>
          <p className="max-w-100 opacity-75">Navegue na rede 5G! Basta ter um aparelho compatível e estar na área de cobertura.</p>
        </div>
      </div>

      <div>
        <Image src="/icon-3.svg" alt="Benefit 1" width={100} height={100} className="mb-4" />
        <div>
          <p className="mb-2">Internet para redes sociais e vídeo</p>
          <p className="max-w-100 opacity-75">Por apenas R$ 5/mês, você tem o dobro de internet para aproveitar suas redes sociais favoritas.</p>
        </div>
      </div>
    </div>
  )
}

export default Index