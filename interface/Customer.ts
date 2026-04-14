import { ViaCepResponse } from "@/lib/ViaCEP"
import { IPlan } from "./Plan"

export interface Customer {
  address: Address,
  plan: IPlan,
  firstStepData?: FirstStepData,
  thirdStepData?: ThirdStepData,
  fourthStepData?: FourthStepData,
  /** ID do pedido retornado na consulta do plano (salvamento progressivo) */
  orderId?: number,
  /** Número do pedido após finalização com sucesso */
  orderNumber?: string,
}

type Address = ViaCepResponse & {
  cep: string,
  homeNumber: string,
  street?: string,
  district?: string,
  city?: string,
  liveIn?: string,
  hasBlockAndLot?: boolean,
  block?: string,
  lot?: string,
  complement?: string,
  TVPlan?: string,
  typeInstalation?: string,
  cnpj?: string,
  landmark?: string,
  floor?: string
}

type FirstStepData = {
  fullName: string,
  tel: string,
  email: string,
  mobileLine?: string,
  mobileLineNumber?: string,
  companyName?: string,
  eSim?: boolean,
  ddi?: string
}

type ThirdStepData = {
  dueDay: string,
  primaryDate: string,
  primaryPeriod: string,
  secondaryDate?: string,
  secondaryPeriod?: string
}

type FourthStepData = {
  bornDate: string,
  cpf: string,
  motherName: string,
  primaryTel?: string,
  secondaryTel?: string,
  termsOfUse?: boolean,
  acceptOffers?: boolean,
  url?: string,
  //
  portability?: boolean,
  portabilityNumber?: string,
  fixIp?: boolean
}