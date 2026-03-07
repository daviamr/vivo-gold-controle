import { ViaCepResponse } from "@/lib/ViaCEP"
import { IPlan } from "./Plan"

export interface Customer {
  address: Address,
  plan: IPlan,
  firstStepData?: FirstStepData,
  thirdStepData?: ThirdStepData,
  fourthStepData?: FourthStepData
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
  eSim?: boolean
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