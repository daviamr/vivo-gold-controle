import { Check, Smartphone, Wifi } from "lucide-react"
import { Button } from "../ui/button"

function Index() {
  return (
    <div className="py-12 text-white bg-default-purple lg:bg-[url('/background-vivo.jpg')] lg:bg-center">
      <div className="flex flex-col px-4 gap-4 container m-auto">
        <h1 className="text-2xl font-bold lg:text-3xl lg:font-light">
          Vivo Controle
        </h1>

        <div className="flex flex-col gap-2 text-1xl">
          <p className="flex items-center gap-2 text-2xl font-light lg:text-5xl lg:font-bold">
            <Smartphone size={64} /> 26 GB
          </p>
          <p className="text-2xl font-light pl-3">
            9GB + 17GB de bônus na portabilidade
          </p>
          <p className="text-2xl pl-3 font-light lg:text-4xl lg:font-bold">
            R$ 59/mês
          </p>

          <div className="my-4">
            <p className="flex items-center gap-2">
              <Check size={18} /> 3 meses de Amazon Prime de cortesia
            </p>
            <p className="flex items-center gap-2">
              <Check size={18} /> 1 ano de IA Perplexity Pro Grátis
            </p>
            <p className="flex items-center gap-2">
              <Check size={18} /> Chip grátis
            </p>
          </div>
        </div>

        <Button className="p-7 px-12 text-[18px] w-max text-default-purple lg:px-24 bg-[#ffffff] hover:bg-[#ba3566]/90 hover:text-white" variant={'vivoPlans'}>Contratar plano</Button>
      </div>
    </div>
  )
}

export default Index