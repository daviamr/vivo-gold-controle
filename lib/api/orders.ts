import { api } from "@/lib/api"
import { VivoFibraAPI } from "@/lib/VivoFibraAPI"

const SECOND_CALL_PATH = "pedido-telefonia-movel/second-call"

export type SecondCallUpdateData = {
  fullname?: string
  phone?: string
  email?: string
  line_action?: string
  line_number_informed?: string
  wants_esim?: number
  cep?: string
  address?: string
  addressnumber?: string
  district?: string
  city?: string
  state?: string
  buildingorhouse?: string
  addressblock?: string
  addresslot?: string
  addresscomplement?: string
  addressreferencepoint?: string
  addressFloor?: string
  dueday?: string | number
  cpf?: string
  birthdate?: string
  phoneAdditional?: string
  terms_accepted?: boolean
  accept_offers?: boolean
}

export type SecondCallResponse = {
  success?: boolean
  order_id: number
  slug?: string
  order_token?: string
  order_token_expires_at?: string
  partial_data: Record<string, unknown>
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null
}

function normalizeSecondCallResponse(data: unknown): SecondCallResponse {
  const raw = asRecord(data) ?? {}
  const partial =
    asRecord(raw.partial_data) ??
    asRecord(raw.pedido) ??
    asRecord(raw.order) ??
    raw

  const orderId =
    (typeof raw.order_id === "number" ? raw.order_id : undefined) ??
    VivoFibraAPI.extractOrderId(raw) ??
    VivoFibraAPI.extractOrderId(partial) ??
    0

  return {
    success: raw.success === true,
    order_id: orderId,
    slug: typeof raw.slug === "string" ? raw.slug : undefined,
    order_token: typeof raw.order_token === "string" ? raw.order_token : undefined,
    order_token_expires_at:
      typeof raw.order_token_expires_at === "string" ? raw.order_token_expires_at : undefined,
    partial_data: partial,
  }
}

export async function getOrderByToken(token: string) {
  const { data } = await api.get(SECOND_CALL_PATH, { params: { token } })
  return normalizeSecondCallResponse(data)
}

export async function updateSecondCall(token: string, payload: SecondCallUpdateData) {
  const { data } = await api.put(SECOND_CALL_PATH, { token, data: payload })
  return data
}
