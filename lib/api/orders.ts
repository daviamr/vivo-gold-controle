import { api } from "@/lib/api"

export type OrderAddressComplement = {
  building_or_house: "house" | "building" | string
  unit_type: string | null
  unit_number: string | null
  floor: string | null
  block: string | null
  lot: string | null
  square: string | null
  home_complement: string | null
  reference_point: string | null
}

export type ClientFingerprint = {
  os: { name: string; version: string }
  device: "desktop" | "mobile" | string
  browser: { name: string; version: string }
  language?: string
  timezone: string
  resolution: { dpr: number; width: number; height: number }
  timezone_offset: number
}

export type OrderPlanPayload = {
  id: string
  name: string
  speed: string
  value: number
  original_value: number | null
}

export type OrderPriceSummary = {
  plan_price: number
  original_price?: number | null
  extras_price: number
  total_monthly: number
}

export type OrderExtra = {
  id: string
  label: string
  description: string
  price: number
  bonus: null
}

export type CreateOrderPayload = {
  status: "ABERTO"
  company: string
  company_id: number
  business_partner: string
  partner_id: number | null
  category: string
  client_type: "PF" | "PJ"
  landing_page: string
  zip_code: string
  address: string
  address_number: string
  district: string
  city: string
  state: string
  address_complement: OrderAddressComplement
  client_ip: string
  fingerprint: ClientFingerprint
  url: string
  terms_accepted: boolean
  accept_offers: boolean
  is_consultation: boolean
  is_order: boolean
  journey: string[]
  previous_order_id: null
  lp_url?: string
}

export type UpdateOrderPayload = Partial<{
  partner_id: number | null
  business_partner: string
  category: string
  landing_page: string
  plan: OrderPlanPayload
  selected_extras: OrderExtra[]
  price_summary: OrderPriceSummary
  full_name: string
  phone: string
  email: string
  is_email_valid: boolean
  email_validation_reason: string
  zip_code: string
  address: string
  address_number: string
  district: string
  city: string
  state: string
  address_complement: OrderAddressComplement
  address_reference_point: string | null
  cpf: string
  birth_date: string
  additional_phone: string | null
  order_number: string
  due_day: string
  terms_accepted: boolean
  accept_offers: boolean
  is_consultation: boolean
  is_order: boolean
  line_action: string
  line_number_informed: string
  wants_esim: boolean
}>

export type CreateOrderResponse = {
  success: boolean
  order: {
    id: number
    company_id: number
    partner_id: number | null
    status: string
    availability?: boolean
  }
  order_token: string
  expires_at?: string
}

export type SecondCallUpdateData = {
  full_name?: string
  cpf?: string
  birth_date?: string
  phone?: string
  email?: string
  zip_code?: string
  address?: string
  address_number?: string
  district?: string
  city?: string
  state?: string
  address_complement?: Record<string, unknown>
  due_day?: string
  additional_phone?: string
  terms_accepted?: boolean
  accept_offers?: boolean
  line_action?: string
  line_number_informed?: string
  wants_esim?: boolean
}

export type SecondCallResponse = {
  success?: boolean
  order_id: number
  slug?: string
  order_token?: string
  order_token_expires_at?: string
  partial_data: Record<string, unknown>
}

export async function getOrderByToken(token: string) {
  const { data } = await api.get<SecondCallResponse>("/telecom/vivo/orders/second-call", {
    params: { token },
  })

  if (data.partial_data) return data

  const raw = data as unknown as Record<string, unknown>
  return {
    ...data,
    partial_data: (raw.order && typeof raw.order === "object"
      ? raw.order
      : raw) as Record<string, unknown>,
  }
}

export async function createOrder(payload: CreateOrderPayload) {
  const { data } = await api.post<CreateOrderResponse>("/telecom/vivo/orders", payload)
  return data
}

export async function updateOrder(
  orderId: number,
  orderToken: string,
  payload: UpdateOrderPayload,
) {
  const { data } = await api.put(`/telecom/vivo/orders/${orderId}`, payload, {
    headers: {
      Authorization: `Bearer ${orderToken}`,
    },
  })

  return data
}

export async function updateSecondCall(token: string, data: SecondCallUpdateData) {
  const { data: responseData } = await api.put("/telecom/vivo/orders/second-call", { token, data })
  return responseData
}

export async function closeOrder(orderId: number, orderToken: string) {
  const { data } = await api.patch(
    `/telecom/vivo/orders/${orderId}/status`,
    { status: "FECHADO" },
    {
      headers: {
        Authorization: `Bearer ${orderToken}`,
      },
    },
  )

  return data
}
