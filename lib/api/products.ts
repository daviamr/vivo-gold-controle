import { api } from "@/lib/api"
import { VIVO_CATEGORY, VIVO_CLIENT_TYPE, VIVO_COMPANY_ID } from "@/lib/constants/vivo"
import type { IPlan } from "@/interface/Plan"

function normalizePlanExtras(extras: unknown): IPlan["extras"] {
  if (extras == null) return []
  if (Array.isArray(extras)) return extras as IPlan["extras"]
  if (typeof extras === "object") return [extras as IPlan["extras"][number]]
  return []
}

type ProductDetail = {
  label?: string
  name?: string
  title?: string
  icon?: string
  images?: string[]
  description?: string
  highlight_top?: boolean
  highlight_bottom?: boolean
}

type ProductExtraOption = {
  id: string
  label?: string
  title?: string
  price: number
  default_checked?: boolean
}

type ProductExtraGroup = {
  id?: string
  label?: string
  images?: string[]
  options?: ProductExtraOption[]
}

type Product = {
  id: number
  company_id?: number
  category?: string
  online?: boolean
  badge?: string | null
  name: string
  offer_title?: string
  offer_subtitle?: string | null
  pricing?: {
    base_monthly?: number | { current_price?: number; original_price?: number }
    installation?: number | { current_price?: number }
  }
  details?: (ProductDetail | string)[]
  extras?:
    | IPlan["extras"]
    | { client?: ProductExtraGroup[]; non_client?: ProductExtraGroup[] }
  created_at?: string
  updated_at?: string
}

type ProductsResponse = {
  success?: boolean
  products?: Product[]
}

function monthlyPrice(pricing: Product["pricing"]): number {
  const base = pricing?.base_monthly
  if (typeof base === "number") return base
  return Number(base?.current_price ?? 0)
}

function installationPrice(pricing: Product["pricing"]): number {
  const installation = pricing?.installation
  if (typeof installation === "number") return installation
  return Number(installation?.current_price ?? 0)
}

function mapDetails(raw: Product["details"]): IPlan["details"] {
  if (!Array.isArray(raw)) return []

  const details: IPlan["details"] = []

  for (const detail of raw) {
    if (typeof detail === "string") {
      details.push({
        title: detail,
        images: [],
        description: "",
        highlight_top: false,
        highlight_bottom: false,
      })
      continue
    }

    const title = detail.title ?? detail.label ?? detail.name ?? ""
    if (!title) continue

    details.push({
      title,
      images: Array.isArray(detail.images)
        ? detail.images.filter((image): image is string => typeof image === "string")
        : [],
      description: detail.description ?? "",
      highlight_top: detail.highlight_top === true,
      highlight_bottom: detail.highlight_bottom === true,
      icon: typeof detail.icon === "string" ? detail.icon : null,
    })
  }

  return details
}

function mapExtras(raw: Product["extras"]): { extras: IPlan["extras"]; extraImages: string[] } {
  if (Array.isArray(raw)) {
    return { extras: normalizePlanExtras(raw), extraImages: [] }
  }

  const groups = raw?.client ?? []
  const extraImages = groups.flatMap((group) => group.images ?? [])
  const extras = groups.flatMap((group) =>
    (group.options ?? []).map((option) => ({
      id: String(option.id),
      price: Number(option.price) || 0,
      title: option.title ?? option.label ?? group.label ?? "",
      default_checked: option.default_checked === true,
      images: group.images ?? [],
    })),
  )

  return { extras, extraImages }
}

export function mapProductToPlan(product: Product): IPlan {
  const { extras, extraImages } = mapExtras(product.extras)

  return {
    id: product.id,
    category: product.category ?? VIVO_CATEGORY,
    online: product.online !== false,
    badge: product.badge ?? "",
    offer_conditions: [],
    name: product.name,
    offer_title: product.offer_title ?? "",
    offer_subtitle: product.offer_subtitle ?? "",
    pricing: {
      base_monthly: monthlyPrice(product.pricing),
      installation: installationPrice(product.pricing),
    },
    details: mapDetails(product.details),
    created_at: product.created_at ?? "",
    updated_at: product.updated_at ?? "",
    extras,
    extra_images: extraImages,
  }
}

export async function fetchProducts() {
  const { data } = await api.get<ProductsResponse | Product[]>("/telecom/vivo/products", {
    params: {
      company_id: VIVO_COMPANY_ID,
      category: VIVO_CATEGORY,
      client_type: VIVO_CLIENT_TYPE,
      page: 1,
      per_page: 100,
    },
  })

  const products = Array.isArray(data) ? data : data.products ?? []

  return products
    .filter((product) => product.online !== false && (product.company_id == null || product.company_id === VIVO_COMPANY_ID))
    .map(mapProductToPlan)
    .sort((a, b) => a.pricing.base_monthly - b.pricing.base_monthly)
}
