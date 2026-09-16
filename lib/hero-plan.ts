import type { IPlan } from "@/interface/Plan"

/** Featured hero plan. `null` until the 30 GB product exists in the API. */
export const HERO_PLAN_ID: number | null = null

export const HERO_FALLBACK = {
  name: "Vivo Controle",
  offerTitle: "30 GB",
  portability: "3GB + 18GB de bônus na portabilidade",
  price: 49,
  benefits: [
    "3 meses de Amazon Prime de cortesia",
    "6 meses grátis de Gemini AI Plus",
    "Meia-entrada na Cinemark todo mês",
  ],
} as const

export function findHeroPlan(plans: IPlan[]): IPlan | null {
  if (HERO_PLAN_ID != null) {
    return plans.find((plan) => plan.id === HERO_PLAN_ID) ?? null
  }

  return (
    plans.find((plan) => /^30\s*GB$/i.test(plan.offer_title.trim())) ?? null
  )
}
