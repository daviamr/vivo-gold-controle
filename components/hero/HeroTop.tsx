"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check, Smartphone } from "lucide-react"
import { withBasePath } from "@/lib/basePath"
import { Button } from "../ui/button"
import { VivoFibraAPI } from "@/lib/VivoFibraAPI"
import type { IPlan } from "@/interface/Plan"
import { findHeroPlan, HERO_FALLBACK } from "@/lib/hero-plan"

function Index() {
  const router = useRouter()
  const [heroPlan, setHeroPlan] = useState<IPlan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const vivoFibraAPI = new VivoFibraAPI()
    void vivoFibraAPI.getPlans().then((plans) => {
      if (!Array.isArray(plans)) return
      setHeroPlan(findHeroPlan(plans))
    }).catch(() => {
      setHeroPlan(null)
    })
  }, [])

  const offerTitle = heroPlan?.offer_title || HERO_FALLBACK.offerTitle
  const price = heroPlan?.pricing.base_monthly ?? HERO_FALLBACK.price

  const handleContract = async () => {
    if (!heroPlan) {
      document.getElementById("card-section")?.scrollIntoView({ behavior: "smooth" })
      return
    }

    const customerData = localStorage.getItem("customer")
    const customer = customerData ? JSON.parse(customerData) : {}
    const dataToSave = { ...customer, plan: heroPlan }
    const vivoFibraAPI = new VivoFibraAPI()

    try {
      setIsSubmitting(true)
      const res = await vivoFibraAPI.saveConsultOrder(
        heroPlan,
        customer.firstStepData?.mobileLine || "new_number",
      )
      const orderId = res.id ?? VivoFibraAPI.extractOrderId(res)
      localStorage.setItem(
        "customer",
        JSON.stringify({
          ...dataToSave,
          ...(orderId ? { orderId } : {}),
          ...(res.order_token ? { orderToken: res.order_token } : {}),
        }),
      )
    } catch {
      localStorage.setItem("customer", JSON.stringify(dataToSave))
    } finally {
      setIsSubmitting(false)
    }

    router.push("/pf/checkout?step=1")
  }

  return (
    <div className="border-b-2">
      <div className="relative isolate overflow-hidden bg-default-purple py-12 text-white lg:bg-transparent">
        <Image
          src={withBasePath("/background-vivo.jpg")}
          alt=""
          fill
          className="-z-10 hidden object-cover object-center lg:block"
          sizes="100vw"
          priority
        />
        <div className="relative z-10 flex flex-col px-4 gap-4 container m-auto">
          <h1 className="text-2xl font-bold lg:text-3xl lg:font-light">
            {HERO_FALLBACK.name}
          </h1>

          <div className="flex flex-col gap-2 text-1xl">
            <p className="flex items-center gap-2 text-2xl font-light lg:text-5xl lg:font-bold">
              <Smartphone size={64} /> {offerTitle}
            </p>
            <p className="text-2xl font-light pl-3">
              {HERO_FALLBACK.portability}
            </p>
            <p className="text-2xl pl-3 font-light lg:text-4xl lg:font-bold">
              R$ {price}/mês
            </p>

            <div className="my-4">
              {HERO_FALLBACK.benefits.map((benefit) => (
                <p key={benefit} className="flex items-center gap-2">
                  <Check size={18} /> {benefit}
                </p>
              ))}
            </div>
          </div>

          <Button
            className="p-7 px-12 text-[18px] w-max text-default-purple lg:px-24 bg-[#ffffff] hover:bg-[#ba3566]/90 hover:text-white"
            variant="vivoPlans"
            disabled={isSubmitting}
            onClick={() => void handleContract()}>
            {isSubmitting ? "Carregando…" : "Contratar plano"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Index
