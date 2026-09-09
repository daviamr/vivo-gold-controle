import type { Customer } from "@/interface/Customer"
import type { IPlan } from "@/interface/Plan"
import { DDI_OPTIONS } from "@/lib/constants/phone"
import { formatCPF } from "@/lib/helpers/formatters"
import type { SecondCallUpdateData } from "@/lib/api/orders"
import type { EditFormData } from "@/components/edit/edit-form"

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null
}

function pick(order: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = order[key]
    if (value == null || value === "") continue
    return String(value)
  }
  return ""
}

function toBool(value: unknown): boolean {
  return value === true || value === 1 || value === "1"
}

export function toBrDate(value: string | null | undefined): string {
  if (!value) return ""
  const iso = value.split("T")[0]
  const isoParts = iso.split("-")
  if (isoParts.length === 3 && isoParts[0].length === 4) {
    const [year, month, day] = isoParts
    return `${day}/${month}/${year}`
  }
  return value
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  if (digits.length !== 8) return value
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

function formatBrPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`
}

export function parsePhone(raw: string | null | undefined): { ddi: string; national: string } {
  const digits = (raw ?? "").replace(/\D/g, "")
  if (!digits) return { ddi: "+55", national: "" }

  const sorted = [...DDI_OPTIONS].sort((a, b) => b.digits.length - a.digits.length)
  for (const option of sorted) {
    if (digits.startsWith(option.digits) && digits.length > option.digits.length) {
      const national = digits.slice(option.digits.length)
      return {
        ddi: option.value,
        national: option.value === "+55" ? formatBrPhone(national) : national,
      }
    }
  }

  return { ddi: "+55", national: formatBrPhone(digits) }
}

function complementOf(order: Record<string, unknown>): Record<string, unknown> {
  return (
    asRecord(order.address_complement_second_call) ??
    asRecord(order.address_complement) ??
    {}
  )
}

export function buildInitialForm(order: Record<string, unknown>): EditFormData {
  const complement = complementOf(order)
  const rawCpf = pick(order, "cpf_second_call", "cpf")
  const rawPhone = pick(order, "phone_second_call", "phone")
  const extraPhone = pick(order, "phoneAdditional", "additional_phone_second_call", "additional_phone")
  const parsedPhone = parsePhone(rawPhone)
  const parsedExtra = parsePhone(extraPhone)
  const liveIn =
    pick(order, "buildingorhouse", "building_or_house") ||
    pick(complement, "building_or_house") ||
    "building"
  const quadra = pick(order, "addressblock", "address_block") || pick(complement, "square", "block")
  const lote = pick(order, "addresslot", "address_lot") || pick(complement, "lot")

  return {
    fullName: pick(order, "full_name_second_call", "fullname", "full_name"),
    tel: parsedPhone.national,
    ddi: parsedPhone.ddi,
    email: pick(order, "email_second_call", "email"),
    mobileLine: pick(order, "line_action", "lineAction") || "new_number",
    mobileLineNumber: pick(order, "line_number_informed", "lineNumberInformed"),
    eSim: toBool(order.wants_esim ?? order.wantsEsim ?? true),
    cep: formatCep(pick(order, "zip_code_second_call", "cep", "zip_code")),
    homeNumber: pick(order, "address_number_second_call", "addressnumber", "address_number"),
    street: pick(order, "address_second_call", "address"),
    district: pick(order, "district_second_call", "district"),
    city: pick(order, "city_second_call", "city"),
    uf: pick(order, "state_second_call", "state", "uf").toUpperCase(),
    liveIn,
    hasBlockAndLot: Boolean(quadra || lote),
    block: quadra,
    lot: lote,
    complement:
      pick(order, "addresscomplement", "address_complement_text") ||
      pick(complement, "home_complement"),
    landmark:
      pick(order, "addressreferencepoint") || pick(complement, "reference_point"),
    floor: pick(order, "addressFloor", "address_floor") || pick(complement, "floor"),
    dueDay: pick(order, "due_day_second_call", "dueday", "due_day"),
    cpf: rawCpf ? formatCPF(rawCpf) || rawCpf : "",
    bornDate: toBrDate(
      pick(order, "birth_date_second_call", "birthdate", "birth_date") || null,
    ),
    primaryTel: parsedPhone.national,
    secondaryTel: extraPhone ? parsedExtra.national : "",
    ddiAdditional: extraPhone ? parsedExtra.ddi : "+55",
    termsOfUse: toBool(
      order.terms_accepted_second_call ?? order.terms_accepted ?? false,
    ),
    acceptOffers: toBool(
      order.accept_offers_second_call ?? order.accept_offers ?? false,
    ),
  }
}

export function mapPlanFromOrder(order: Record<string, unknown>): IPlan | null {
  const plan = asRecord(order.plan)
  if (!plan) return null
  const id = Number(plan.id)
  if (!Number.isFinite(id) || id <= 0) return null

  const extrasRaw = plan.selected_additionals ?? plan.extras
  const extras = Array.isArray(extrasRaw)
    ? extrasRaw.map((item, index) => {
        const extra = asRecord(item) ?? {}
        return {
          id: String(extra.id ?? index),
          price: Number(extra.price ?? 0),
          title: String(extra.title ?? extra.label ?? ""),
          default_checked: true,
          checked: true,
        }
      })
    : []

  return {
    id,
    category: String(plan.category ?? ""),
    online: true,
    badge: String(plan.badge ?? ""),
    offer_conditions: [],
    name: String(plan.name ?? plan.plan_name ?? ""),
    offer_title: String(plan.offer_title ?? plan.speed ?? ""),
    offer_subtitle: String(plan.offer_subtitle ?? ""),
    pricing: {
      base_monthly: Number(plan.base_price ?? plan.value ?? plan.base_monthly ?? 0),
      installation: Number(plan.installation ?? 0),
    },
    details: [],
    created_at: "",
    updated_at: "",
    extras,
  }
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "")
}

function buildPhone(ddi: string, national: string): string {
  const ddiDigits = onlyDigits(ddi || "+55")
  const digits = onlyDigits(national)
  if (!digits) return ""
  if (digits.startsWith(ddiDigits)) return digits
  return `${ddiDigits}${digits}`
}

export function buildSecondCallPayload(form: EditFormData): SecondCallUpdateData {
  const payload: SecondCallUpdateData = {
    full_name: form.fullName || undefined,
    phone: buildPhone(form.ddi, form.tel) || undefined,
    email: form.email || undefined,
    line_action: form.mobileLine || undefined,
    wants_esim: form.eSim ? 1 : 0,
    zip_code: form.cep || undefined,
    address: form.street || undefined,
    address_number: form.homeNumber || undefined,
    district: form.district || undefined,
    city: form.city || undefined,
    state: form.uf || undefined,
    due_day: form.dueDay || undefined,
    cpf: onlyDigits(form.cpf) || undefined,
    birth_date: form.bornDate || undefined,
    terms_accepted: form.termsOfUse,
    accept_offers: form.acceptOffers,
    address_complement: {
      building_or_house: form.liveIn || "house",
      unit_type: null,
      unit_number: null,
      floor: form.floor || null,
      block: form.block || null,
      lot: form.lot || null,
      square: form.block || null,
      home_complement: form.complement || null,
      reference_point: form.landmark || null,
    },
  }

  if (form.mobileLineNumber) {
    payload.line_number_informed = onlyDigits(form.mobileLineNumber)
  }
  if (form.secondaryTel) {
    payload.additional_phone = buildPhone(form.ddiAdditional, form.secondaryTel)
  }

  return payload
}

export function hydrateCustomer(
  order: Record<string, unknown>,
  orderId: number,
): Customer {
  const form = buildInitialForm(order)
  const plan = mapPlanFromOrder(order)

  return {
    orderId,
    plan: plan ?? ({} as IPlan),
    firstStepData: {
      fullName: form.fullName,
      tel: form.tel,
      email: form.email,
      mobileLine: form.mobileLine,
      mobileLineNumber: form.mobileLineNumber || undefined,
      eSim: form.eSim,
      ddi: form.ddi,
    },
    address: {
      cep: form.cep,
      homeNumber: form.homeNumber,
      street: form.street,
      district: form.district,
      city: form.city,
      uf: form.uf,
      logradouro: form.street,
      bairro: form.district,
      localidade: form.city,
      complemento: form.complement,
      liveIn: form.liveIn,
      hasBlockAndLot: form.hasBlockAndLot,
      block: form.block || undefined,
      lot: form.lot || undefined,
      complement: form.complement || undefined,
      landmark: form.landmark || undefined,
      floor: form.floor || undefined,
    },
    thirdStepData: {
      dueDay: form.dueDay,
      primaryDate: "",
      primaryPeriod: "",
    },
    fourthStepData: {
      cpf: form.cpf,
      bornDate: form.bornDate,
      primaryTel: form.primaryTel,
      secondaryTel: form.secondaryTel || undefined,
      ddiAdditional: form.ddiAdditional,
      termsOfUse: form.termsOfUse,
      acceptOffers: form.acceptOffers,
    },
  }
}
