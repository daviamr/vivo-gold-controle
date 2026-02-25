'use client'

import { Customer } from "@/interface/Customer"
import { addCurrentYear, formatToBRL } from "@/lib/helpers/formatters"
import { CircleCheck, Info, MessageSquareMore, TriangleAlert } from "lucide-react"
import { useEffect, useState } from "react"

function Index() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const CONDITIONS = [
    { message: 'A velocidade está sujeita à verificação no ato da instalação.' },
    { message: 'A performance do Wi-Fi poderá variar de acordo com o ambiente em que for instalado.' },
    { message: 'A taxa de instalação é gratuita para seu pedido.' },
    { message: 'Caso precise de alteração no seu pedido ou na instalação, entre em contato com o número 0800 770 0150 e informe o seu CNPJ. Horário de atendimento: segunda a sexta das 8h às 20h e sábado das 8h às 18h.' },
  ]
  const ALERT = [
    { message: 'A Vivo nunca entra em contato solicitando dados bancários ou de cartão de crédito. Para sua segurança, nunca forneça estes dados.' },
    { message: 'A Vivo nunca entra em contato para dizer que não há disponibilidade de Fibra na região da sua empresa.' },
    { message: 'Caso a visita técnica necessite ser reagendada, ligaremos no telefone informado.' },
    { message: 'Se você já tem internet e está mudando para Vivo, espere a instalação da Vivo Fibra antes de cancelar o serviço atual.' }
  ]

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer')
    if (storedCustomer) {
      try {
        const parsedCustomer = JSON.parse(storedCustomer)
        setCustomer(parsedCustomer)
      } catch (error) {
        console.error('Erro ao fazer parse do customer:', error)
        setCustomer(null)
      }
    }
  }, [])

  return (
    <div className="container m-auto px-4">

      <div className="grid gap-4 lg:grid-cols-2">

        <div className="my-12 text-center">

          <div className="flex flex-col items-center gap-4">
            <CircleCheck color="#6b4497" size={48} />
            <div>
              <h1 className="text-2xl font-bold">Seu pedido está quase concluído!</h1>
              <h2 className="font-bold">Em breve você receberá um SMS para realizar a biometria e dar continuidade ao seu pedido.</h2>
            </div>
          </div>

          <div className="bg-white shadow-xs p-4 rounded-sm mt-4">
            <p className="uppercase text-left">Próximos passos</p>

            <div className="grid gap-2 mt-4 text-left">
              <div className="flex gap-2 lg:items-center">
                <MessageSquareMore color="#6b4497" size={32} className="shrink-0" />
                <p>
                  <strong>Fique atento</strong>: você receberá um SMS com as instruções para fazer sua biometria e finalizar esta etapa.
                </p>
              </div>

              <div className="flex gap-2 lg:items-center">
                <Info color="#6b4497" size={32} className="shrink-0" />
                <p>É necessário ter uma pessoa maior de 18 anos no local.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 my-4">
            <div className="text-left">
              <p className="text-2xl font-bold mb-2">Resumo do pedido: 1234</p>
              <div className="border rounded-sm py-4 text-left lg:min-h-[227px]">
                <div className="px-4 pb-4">
                  <p>{customer?.plan.plan} {customer?.plan?.fibra}</p>
                  <p>Vivo Pós {customer?.plan?.pos} GB</p>
                  {customer?.plan?.tv && (
                    <p> {customer?.plan?.tv} Plano TV Tal</p>
                  )}
                  <p>6 meses de Amazon Prime cortesia</p>
                  <p>6 meses de HBO Max Básico Ads cortesia</p>
                </div>
                <p className="flex justify-between items-center border-t font-bold px-4 pt-4">Total: <span className="text-2xl">{formatToBRL(customer?.plan?.price || 0)}/mês</span></p>
              </div>
            </div>

            <div className="text-left mb-4">
              <p className="text-2xl font-bold mb-2">Instalação:</p>
              <div className="border rounded-sm py-4 text-left">
                <div className="px-4 pb-4">
                  <p className="font-bold mb-2">Endereço da instalação:</p>
                  <p>{customer?.address.street}, {customer?.address.homeNumber}, {customer?.address.bairro} - {customer?.address.city}, {customer?.address.cep}</p>
                </div>

                <div className="border-t px-4 pt-4">

                  <p className="font-bold mb-2">Pré-agendamento da instalação:</p>
                  <p className="flex justify-between">
                    {addCurrentYear(customer?.thirdStepData?.primaryDate || '')}
                    <span> {customer?.thirdStepData?.primaryPeriod === 'morning' ? 'Manhã' : 'Tarde'}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    {addCurrentYear(customer?.thirdStepData?.secondaryDate || '')}
                    <span>{customer?.thirdStepData?.secondaryPeriod === 'morning' ? 'Manhã' : 'Tarde'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-sm p-4 text-left mb-4">
            <p className="mb-2 font-bold">Informações do comprador:</p>
            <p>Nome: <strong>{customer?.firstStepData?.fullName}</strong></p>
            <p>E-mail: <strong>{customer?.firstStepData?.email}</strong></p>
          </div>

          <div className="border rounded-sm p-4 text-left">
            <p className="mb-2 font-bold">Condições de aquisição:</p>

            <ul>
              {CONDITIONS.map((c, i) => (
                <li key={i} className="mb-2">&#8226; {c.message}</li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-2 border-[#ffc107] rounded-sm text-center px-4 py-8 lg:mt-12 lg:h-max">
          <div className="flex flex-col items-center justify-center mb-4">
            <TriangleAlert size={48} color="#ffc107" />
            <p className="text-2xl text-default-purple font-bold uppercase">Fique Atento:</p>
          </div>

          <ul>
            {ALERT.map((c, i) => (
              <li key={i} className="mb-2">&#8226; {c.message}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  )
}

export default Index