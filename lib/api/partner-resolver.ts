import { api } from "@/lib/api"
import {
  VIVO_CATEGORY,
  VIVO_COMPANY_ID,
  getVivoClientType,
  type VivoClientType,
} from "@/lib/constants/vivo"
import { getPartnerHashFromUrl, isSamePartnerHash } from "@/lib/partner-hash"

export type PartnerData = {
  partner_id: number
  partner_name: string
  partner_hash: string
  logo_url?: string
  cnpj?: string
  email?: string
}

export type ResolvePartnerInput = {
  cep?: string | null
  uf?: string | null
  partnerHash?: string | null
  clientType?: VivoClientType
}

type PartnerResolverResponse = {
  success: boolean
  partner: PartnerData | null
}

function normalizeInput(
  cepOrQuery?: string | null | ResolvePartnerInput,
): ResolvePartnerInput {
  if (cepOrQuery == null || typeof cepOrQuery === "string") {
    return { cep: cepOrQuery }
  }
  return cepOrQuery
}

async function fetchPartnerResolver(input: ResolvePartnerInput) {
  const partnerHash = input.partnerHash ?? getPartnerHashFromUrl()
  const clientType = input.clientType ?? getVivoClientType()
  const query = new URLSearchParams({
    company_id: String(VIVO_COMPANY_ID),
    client_type: clientType,
    category: VIVO_CATEGORY,
  })

  const sanitizedCep = input.cep?.replace(/\D/g, "") ?? ""
  const uf = input.uf?.trim().toUpperCase() ?? ""
  if (sanitizedCep) query.set("cep", sanitizedCep)
  if (uf) query.set("uf", uf)
  if (partnerHash) query.set("partner_hash", partnerHash)

  if (!sanitizedCep && !uf && !partnerHash) return null

  const { data } = await api.get<PartnerResolverResponse>(`/partner-resolver?${query.toString()}`)
  return data.partner
}

export async function resolvePartner(
  cepOrQuery?: string | null | ResolvePartnerInput,
) {
  const input = normalizeInput(cepOrQuery)
  const partnerHash = input.partnerHash ?? getPartnerHashFromUrl()
  const partner = await fetchPartnerResolver(input)

  if (
    partnerHash &&
    partner?.partner_hash &&
    !isSamePartnerHash(partner.partner_hash, partnerHash)
  ) {
    return null
  }

  return partner
}
