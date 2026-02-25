import { viaCepApi } from "./api"

export interface ViaCepResponse {
  cep: string,
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  erro?: boolean
}

export class ViaCEP {
  async searchCEP(cep: string) {
    try {
      const response = await viaCepApi.get<ViaCepResponse>(`/${cep}/json/`)
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }
}