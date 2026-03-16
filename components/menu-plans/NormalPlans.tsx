'use client'

import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, Smartphone, Wifi } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { VivoFibraAPI } from "@/lib/VivoFibraAPI"
import { IPlan } from "@/interface/Plan"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const planSchema = z.object({
  checked: z.boolean().optional()
})

export type PlanFormData = z.infer<typeof planSchema>

function Index() {
  const ICONS = {
    APPS: ['/icon-netflix.png', '/icon-netflix.png', '/icon-netflix.png', '/icon-netflix.png', '/icon-netflix.png', '/icon-netflix.png']
  }
  const [plans, setPlans] = useState<any>(null)
  const router = useRouter()
  const [openDetails, setOpenDetails] = useState(false)
  const [checkedStates, setCheckedStates] = useState<boolean[]>([])
  const vivoFibraAPI = new VivoFibraAPI()
  const [currentPage, setCurrentPage] = useState(0)

  const form = useForm<PlanFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(planSchema),
    defaultValues: {
      checked: false
    },
  })
  const { handleSubmit, formState: { errors }, register, watch } = form
  console.log(plans)

  const handleCheckout = (plan: IPlan) => {
    const customerData = localStorage.getItem('customer')
    const customer = customerData ? JSON.parse(customerData) : {}
    const dataToSave = { ...customer, plan }
    localStorage.setItem('customer', JSON.stringify(dataToSave))
    router.push(`pf/checkout?step=1`)
  }

  const vivoControlePlans = async () => {
    return await vivoFibraAPI.getPlans()
  }

  // Inicializa os estados quando os plans carregam
  useEffect(() => {
    const fetchPlans = async () => {
      const plans = await vivoControlePlans()
      setPlans(plans)
      setCheckedStates(plans.map((plan: IPlan) => plan?.extras[0]?.default_checked ?? false))
    }
    fetchPlans()
  }, [])

  const handleCheckedChange = (index: number, value: boolean) => {
    setCheckedStates(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })

    setPlans((prev: IPlan[]) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        extras: updated[index].extras.map((extra, extraIndex) =>
          extraIndex === 0 ? { ...extra, checked: value } : extra
        )
      }
      return updated
    })
  }

  const maxCardsPerPage = 4

  const getPaginatedPlans = () => {
    if (!plans || plans.length === 0) return []
    const startIndex = currentPage * maxCardsPerPage
    const endIndex = startIndex + maxCardsPerPage
    return plans.slice(startIndex, endIndex)
  }

  const handleNextPage = () => {
    if (!plans) return
    const totalPages = Math.ceil(plans.length / maxCardsPerPage)
    setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 >= 0 ? prev - 1 : prev))
  }

  const totalPages = plans ? Math.ceil(plans.length / maxCardsPerPage) : 0

  const paginatedPlans = getPaginatedPlans()

  return (
    <div id="card-section">
      <div className="flex flex-col gap-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {(paginatedPlans !== null && paginatedPlans.length > 0) ? (
            paginatedPlans.map((plan: IPlan, index: number) => (
              <div className="relative flex flex-col h-full max-w-[378px] border rounded-sm bg-white" key={`${currentPage}-${index}`}>

                <div className="p-4 pt-8">
                  <span className="absolute -top-4 left-0 text-sm bg-default-purple text-white py-1 px-6 rounded-sm rounded-bl-none uppercase">Volta às Aulas &#128214;</span>

                  <p>{plan.name}</p>
                  <div className="flex gap-2 items-baseline mt-1 pb-2">
                    <Smartphone />
                    <div>
                      <p className="flex items-center gap-2 text-3xl">{plan?.offer_title}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 my-2">
                    {plan.details[0]?.title && (
                      <p className="flex items-center gap-2">
                        <Check size={18} /> {plan?.details[0]?.title} GB de franquia
                      </p>
                    )}
                    {(plan?.extras[0]?.default_checked === true ||
                      plan?.extras[0]?.checked === true) && (
                        <p className="flex items-center gap-2">
                          <Check size={18} /> {plan?.extras[0]?.title} GB de bônus
                        </p>
                      )}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-b-sm mt-1 border-t">
                  {plan.extras[0]?.title && (
                    <>
                      <div className="flex items-center gap-4">
                        <Checkbox
                          id={`moreData-${index}`}
                          checked={checkedStates[index] ?? false}
                          onCheckedChange={(value) => handleCheckedChange(index, value as boolean)} />
                        <Label htmlFor="moreData" className="text-sm font-bold opacity-75">{plan?.extras[0]?.title} para suas redes sociais e vídeo por R$ {plan?.extras[0]?.price}</Label>
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
                    </>
                  )}
                </div>
                <div className="mt-auto px-4 py-8">
                  <p className="text-2xl pb-8">
                    R$ {plan.pricing.base_monthly} /mês
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
            ))
          ) : 'loading...'}
        </div>

        {plans && plans.length > maxCardsPerPage && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              type="button"
              className="rounded-full cursor-pointer border-none"
              onClick={handlePrevPage}
              disabled={currentPage === 0}>
              <ArrowLeft color="purple" />
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 cursor-pointer ${currentPage === index
                      ? "bg-purple-600 scale-125"
                      : "bg-gray-300 hover:bg-purple-300"
                    }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              type="button"
              className="rounded-full cursor-pointer border-none"
              onClick={handleNextPage}
              disabled={currentPage + 1 >= totalPages}>
              <ArrowRight color="purple" />
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Index