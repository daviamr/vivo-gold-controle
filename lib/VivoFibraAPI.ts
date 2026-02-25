import { Customer } from "@/interface/Customer";
import { api } from "./api"
import { CreateOrderResponse } from "@/interface/Order";


export class VivoFibraAPI {
  async createOrder(data: Customer): Promise<CreateOrderResponse> {
    const payload = this.orderPayload(data)
    console.log('>>> payload', payload)
    const response = await api.post('pedidos-banda-larga',
      payload, { headers: { 'Content-Type': 'application/json' } })

    console.log('>>> response', response.data)
    return response.data
  }

  orderPayload(data: Customer) {
    const { firstStepData, address: secondStepData, thirdStepData, fourthStepData, plan } = data
    return {
      "pedido": {
        "cep": secondStepData?.cep,
        "addressnumber": secondStepData?.homeNumber,
        "typeclient": 'pf',
        "plan": {
          "name": plan?.fibra,
          "quantity": 1,
          "price": plan?.price
        },
        "fullname": firstStepData?.fullName,
        "phone": this.onlyNumber(firstStepData?.tel || ''),
        "email": firstStepData?.email,
        "cpf": fourthStepData?.cpf,
        ...(secondStepData?.cnpj && { "cnpj": secondStepData?.cnpj }),
        ...(firstStepData?.companyName && { "razaosocial": firstStepData?.companyName }),
        "birthdate": fourthStepData?.bornDate,
        "motherfullname": fourthStepData?.motherName,
        ...(secondStepData?.block && { "addressblock": secondStepData?.block }),
        ...(secondStepData?.lot && { "addresslot": secondStepData?.lot }),
        "address": secondStepData?.street,
        "district": secondStepData?.district,
        "city": secondStepData?.city,
        "state": secondStepData?.uf,
        "buildingorhouse": secondStepData?.liveIn === 'house' ? 2 : 1,
        "addresscomplement": secondStepData?.complemento,
        "addressreferencepoint":
          (secondStepData?.landmark ? secondStepData?.landmark :
            secondStepData?.floor ? secondStepData?.floor : ''),
        "dueday": thirdStepData?.dueDay,
        "installation_preferred_date_one": thirdStepData?.primaryDate,
        "installation_preferred_period_one": thirdStepData?.primaryPeriod.toUpperCase(),
        "installation_preferred_date_two": thirdStepData?.secondaryDate,
        "installation_preferred_period_two": thirdStepData?.secondaryPeriod?.toUpperCase(),
        "terms_accepted": fourthStepData?.termsOfUse,
        "ordernumber": 1234,
        "url": fourthStepData?.url,
        "accept_offers": fourthStepData?.acceptOffers
      }
    }
  }

  onlyNumber(value: string): string {
    return value.replace(/\D/g, '');
  }
}