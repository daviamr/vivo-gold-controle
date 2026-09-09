import { api } from "@/lib/api"
import {
  VIVO_CATEGORY,
  VIVO_COMPANY_ID,
} from "@/lib/constants/vivo"
import { getPartnerHashFromUrl } from "@/lib/partner-hash"

export type PartnerData = {
  partner_id: number
  partner_name: string
  partner_hash: string
  logo_url?: string
  cnpj?: string
  email?: string
}

type PartnerResolverResponse = {
  success: boolean
  partner: PartnerData | null
}

async function fetchPartnerResolver(cep: string, partnerHash?: string | null) {
  const sanitizedCep = cep.replace(/\D/g, "")
  const query = new URLSearchParams({
    company_id: String(VIVO_COMPANY_ID),
    client_type: "PF",
    category: VIVO_CATEGORY,
    cep: sanitizedCep,
  })

  if (partnerHash) {
    query.set("partner_hash", partnerHash)
  }

  const { data } = await api.get<PartnerResolverResponse>(`/partner-resolver?${query.toString()}`)
  return data.partner
}

export async function resolvePartner(cep: string) {
  const partnerHash = getPartnerHashFromUrl()

  try {
    return await fetchPartnerResolver(cep, partnerHash)
  } catch (error) {
    if (!partnerHash) {
      throw error
    }

    return fetchPartnerResolver(cep, null)
  }
}
