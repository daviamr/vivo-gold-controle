"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CalendarDays, Check, Loader, MapPin, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOrderByToken, updateSecondCall } from "@/lib/api/orders"
import { buildInitialForm, buildSecondCallPayload, mapPlanFromOrder } from "@/lib/second-call-mappers"
import type { IPlan } from "@/interface/Plan"
import { initialEditForm, type EditFormData } from "./edit-form"
import EditFirstSection from "./EditFirstSection"
import EditSecondSection from "./EditSecondSection"
import EditThirdSection from "./EditThirdSection"
import EditFourthSection from "./EditFourthSection"

const MOBILE_LINE_LABELS: Record<string, string> = {
  new_number: "Adquirir um novo número Vivo",
  port_in_to_vivo: "Transferir meu número pra Vivo",
  keep_vivo_number: "Manter meu número Vivo",
}

const LIVE_IN_LABELS: Record<string, string> = {
  building: "Edifício",
  house: "Casa",
}

function formatBrlMonthly(value: number | undefined | null): string {
  if (value == null || Number.isNaN(value)) return "—"
  return `${value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/mês`
}

export default function EditPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [plan, setPlan] = useState<IPlan | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(token))
  const [form, setForm] = useState<EditFormData>(initialEditForm)
  const [errors, setErrors] = useState<Partial<Record<keyof EditFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    if (!token) return

    getOrderByToken(token)
      .then((data) => {
        const order = data.partial_data
        setForm(buildInitialForm(order))
        setPlan(mapPlanFromOrder(order))
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const handleChange = useCallback((field: keyof EditFormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return

    setIsSubmitting(true)
    setErrors({})

    try {
      await updateSecondCall(token, buildSecondCallPayload(form))
      setSubmitSuccess(true)
      router.push("/editar-concluido")
    } catch {
      setErrors({ fullName: "Não foi possível salvar os dados. Tente novamente." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addressLine1 = [form.street, form.homeNumber].filter(Boolean).join(", ")
  const cityUf = [form.city, form.uf].filter(Boolean).join("/")
  const addressLine2 = [form.district, cityUf].filter(Boolean).join(" — ")

  return (
    <div className="container m-auto px-4 my-12">
      <div className="relative grid gap-4 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-sm shadow-xs">
          <h1 className="text-2xl font-semibold text-gray-800">Cadastro Vivo Controle</h1>
          <p className="text-sm text-gray-600 mt-1">
            Preencha ou corrija os dados abaixo para contratar seu plano.
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader className="animate-spin" size={48} color="purple" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="gap-4 py-4 border-b">
                <p className="font-bold text-gray-800">
                  <span className="text-gray-500 mr-2">1.</span>
                  Dados Pessoais do Titular
                </p>
                <EditFirstSection form={form} onChange={handleChange} errors={errors} />
              </div>

              <div className="gap-4 py-4 border-b">
                <p className="font-bold text-gray-800">
                  <span className="text-gray-500 mr-2">2.</span>
                  Endereço de entrega do Chip
                </p>
                <EditSecondSection form={form} onChange={handleChange} errors={errors} />
              </div>

              <div className="gap-4 py-4 border-b">
                <p className="font-bold text-gray-800">
                  <span className="text-gray-500 mr-2">3.</span>
                  Fatura Digital
                </p>
                <EditThirdSection form={form} onChange={handleChange} errors={errors} />
              </div>

              <div className="gap-4 py-4 border-b">
                <p className="font-bold text-gray-800">
                  <span className="text-gray-500 mr-2">4.</span>
                  Confirmação
                </p>
                <EditFourthSection form={form} onChange={handleChange} errors={errors} />
              </div>

              {errors.fullName && (
                <p className="text-sm text-red-600 mt-2">{errors.fullName}</p>
              )}

              {submitSuccess && (
                <p className="text-sm text-green-600 mt-4 font-medium">
                  Dados salvos com sucesso!
                </p>
              )}

              <Button
                type="submit"
                variant="vivo"
                disabled={isSubmitting || !token}
                className="w-full py-7 rounded-sm text-1xl text-white mt-8">
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </form>
          )}
        </div>

        {plan && (
          <div className="bg-white p-4 rounded-sm py-8 h-max shadow-xs">
            <p className="text-2xl font-semibold text-gray-800 mb-4">Resumo do pedido</p>

            <div className="space-y-3 border-b pb-4">
              <div className="flex items-start justify-between gap-2">
                <p className="flex items-center gap-2 font-light shrink min-w-0">
                  <Smartphone size={18} className="shrink-0" />
                  <span className="leading-snug">{plan.name}</span>
                </p>
                <p className="font-light text-right whitespace-nowrap">
                  {formatBrlMonthly(plan.pricing?.base_monthly)}
                </p>
              </div>
              {plan.offer_title && (
                <p className="text-sm font-medium text-gray-700 pl-7">{plan.offer_title}</p>
              )}
              {plan.extras?.some((ex) => ex.default_checked === true || ex.checked === true) && (
                <ul className="pl-7 space-y-1">
                  {plan.extras
                    .filter((ex) => ex.default_checked === true || ex.checked === true)
                    .map((ex) => (
                      <li key={ex.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-default-purple shrink-0" />
                        {ex.title}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div className="border-b py-4 space-y-3">
              <p className="text-sm font-semibold text-gray-800">Contratação</p>
              {form.mobileLine && (
                <div className="flex items-start justify-between gap-2 text-sm">
                  <span className="text-gray-500 shrink-0">Linha</span>
                  <span className="text-right text-gray-800">
                    {MOBILE_LINE_LABELS[form.mobileLine] ?? form.mobileLine}
                  </span>
                </div>
              )}
              {(form.mobileLine === "port_in_to_vivo" || form.mobileLine === "keep_vivo_number") &&
                Boolean(form.mobileLineNumber?.trim()) && (
                  <div className="flex items-start justify-between gap-2 text-sm">
                    <span className="text-gray-500 shrink-0">Número</span>
                    <span className="text-right text-gray-800 tabular-nums">{form.mobileLineNumber}</span>
                  </div>
                )}
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-gray-500">Chip</span>
                <span className="text-right font-medium text-gray-800">
                  {form.eSim ? "eSIM (virtual)" : "Chip físico (entrega)"}
                </span>
              </div>
            </div>

            {(form.cep || addressLine1) && (
              <div className="border-b py-4 space-y-2">
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin size={16} aria-hidden /> Endereço de entrega do chip
                </p>
                {addressLine1 && <p className="text-sm text-gray-800 pl-6">{addressLine1}</p>}
                {addressLine2 && <p className="text-sm text-gray-600 pl-6">{addressLine2}</p>}
                {form.cep && <p className="text-sm text-gray-600 pl-6">CEP {form.cep}</p>}
                {form.liveIn && (
                  <p className="text-sm text-gray-600 pl-6">
                    Tipo: {LIVE_IN_LABELS[form.liveIn] ?? form.liveIn}
                  </p>
                )}
              </div>
            )}

            {form.dueDay && (
              <div className="border-b py-4 flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <CalendarDays size={16} aria-hidden /> Fatura digital
                </p>
                <p className="text-sm text-gray-800 font-medium whitespace-nowrap">
                  Vencimento dia {form.dueDay}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-1">
              <p className="flex items-center gap-2 font-light">Total</p>
              <p className="font-semibold">{formatBrlMonthly(plan.pricing?.base_monthly)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
