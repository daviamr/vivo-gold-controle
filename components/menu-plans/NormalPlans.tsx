'use client'

import { Check, ChevronDown, ChevronUp, Smartphone, Wifi } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

function Index() {
  const ICONS = {
    APPS: ['/icon-netflix.png', '/icon-netflix.png', '/icon-netflix.png', '/icon-netflix.png', '/icon-netflix.png', '/icon-netflix.png']
  }
  const mockedPlans = [
    {
      plan: 'Vivo Controle',
      pos: '26',
      franchise: '9',
      bonus: '17',
      price: 59,
    },
    {
      plan: 'Vivo Controle',
      pos: '39',
      franchise: '11',
      bonus: '17',
      price: 75,
    },
    {
      plan: 'Vivo Controle Saúde',
      pos: '41',
      franchise: '12',
      bonus: '17',
      price: 90,
    },
    {
      plan: 'Vivo Controle Educação',
      pos: '41',
      franchise: '12',
      bonus: '17',
      price: 90,
    }
  ]
  const [plans, setPlans] = useState(mockedPlans)
  const router = useRouter()
  const [openDetails, setOpenDetails] = useState(false)

  const handleCheckout = (plan: typeof mockedPlans[0]) => {
    const customerData = localStorage.getItem('customer')
    const customer = customerData ? JSON.parse(customerData) : {}
    const dataToSave = { ...customer, plan }
    localStorage.setItem('customer', JSON.stringify(dataToSave))
    router.push(`pf/checkout?step=1`)
  }

  return (
    <div id="card-section">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
        {plans.map((plan, index) => (
          <div className="relative max-w-[378px] border rounded-sm bg-white" key={index}>

            <div className="p-4 pt-8">
              <span className="absolute -top-4 left-0 text-sm bg-default-purple text-white py-1 px-6 rounded-sm rounded-bl-none uppercase">Volta às Aulas &#128214;</span>

              <p>{plan.plan}</p>
              <div className="flex gap-2 items-baseline mt-1 pb-2">
                <Smartphone />
                <div>
                  <p className="flex items-center gap-2 text-3xl">{plan.pos} GB</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 my-2">
                {plan?.franchise && (
                  <p className="flex items-center gap-2">
                    <Check size={18} /> {plan.franchise} GB de franquia
                  </p>
                )}
                {plan?.bonus && (
                  <p className="flex items-center gap-2">
                    <Check size={18} /> {plan.bonus} GB de bônus
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-white rounded-b-sm mt-1 border-t">
              <div className="flex items-center gap-4">
                <Checkbox id="moreData" />
                <Label htmlFor="moreData" className="text-sm font-bold opacity-75">+ {plan?.bonus}GB para suas redes sociais e vídeo por R$ {plan?.price}</Label>
              </div>
              <div className="flex items-center gap-2 mt-2 lg:pl-8">
                {ICONS.APPS.map((icon, index) => (
                  <Image
                    key={index}
                    src={icon}
                    alt={`app`}
                    width={32}
                    height={32}
                    className="rounded-sm" />
                ))}
              </div>
            </div>

            <div className="px-4 py-8">
              <p className="text-2xl pb-8">
                R$ {plan.price} /mês
              </p>

              <Button
                variant={'vivoPlans'}
                className="w-full rounded-sm p-6 text-white tracking-wider"
                onClick={() => handleCheckout(plan)}>
                Contratar Vivo Controle
              </Button>

              <span
                className="flex justify-center items-center gap-2 pt-8 text-sm cursor-pointer"
                onClick={() => setOpenDetails(prev => !prev)}>
                Mais detalhes {openDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>

            {openDetails && (
              <div className="px-4 pb-8">
                <div className="pb-4">

                  <p className="text-sm pb-1 font-semibold">6 meses de Amazon Prime de cortesia</p>
                  <Image
                    src={'/icon-netflix.png'}
                    alt={`app`}
                    width={32}
                    height={32}
                    className="rounded-sm" />
                </div>

                <div className="pb-4">
                  <p className="text-sm pb-1 font-semibold">1 ano grátis de IA com Perplexity Pro</p>
                  <Image
                    src={'/icon-netflix.png'}
                    alt={`app`}
                    width={32}
                    height={32}
                    className="rounded-sm" />
                </div>

                <div className="pb-4">
                  <p className="text-sm font-semibold">Apps Inclusos</p>
                  <p className="text-sm pb-1 opacity-75">Newco Play</p>
                  <Image
                    src={'/icon-netflix.png'}
                    alt={`app`}
                    width={32}
                    height={32}
                    className="rounded-sm mb-4" />
                </div>

                <div>
                  <p className="text-sm pb-4 font-semibold">Instalação com Wi-Fi Grátis</p>
                  <p className="text-sm pb-4 font-semibold">Modem Grátis</p>
                  <p className="text-sm pb-1 font-semibold">Download</p>
                  <p className="text-sm pb-4">172 Kbps + 599,8 Mbps de bônus*</p>
                  <p className="text-sm pb-1 font-semibold">Upload</p>
                  <p className="text-sm pb-1">86 Kbps + 299,9 Mbps de bônus*</p>
                  <p className="text-sm">Bonificação mediante adimplência</p>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}

export default Index