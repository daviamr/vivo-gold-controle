import TermsOfUseBody from "@/components/terms-of-use/TermsOfUseBody"

export default function TermsOfUse() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-sm p-8 max-w-200 m-auto py-[62px]">
        <h1 className="text-2xl font-bold text-[#6c4598] sm:text-3xl">
          Termos e Condições de Uso
        </h1>
        <p className="text-xs text-[#747474] mt-2">Última atualização: 17, junho de 2026</p>
        <TermsOfUseBody />
      </div>
    </div>
  )
}
