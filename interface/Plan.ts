export interface IPlan {
  id: number,
  category: string,
  online: boolean,
  badge: string,
  offer_conditions: OfferConditions,
  name: string,
  offer_title: string,
  offer_subtitle: string,
  pricing: Pricing,
  details: Details
  created_at: string,
  updated_at: string,
  extras: Extras
}

type OfferConditions = {
  url: string,
  type: string
}[]

type Pricing = {
  base_monthly: number,
  installation: number
}

type Details = {
  title: string,
  images: string[],
  description: string,
  highlight_top: boolean,
  highlight_bottom: boolean
}[]

type Extras = {
  id: string,
  price: number,
  title: string,
  default_checked: boolean,
  checked?: boolean
}[]