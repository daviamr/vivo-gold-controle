'use client'

import { useEffect, useState } from "react"
import CheckoutSteps from '../../../components/checkout-steps/CheckoutSteps'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { withMask } from "use-mask-input"
import { Button } from "@/components/ui/button"
import { Loader, Wifi } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Customer } from "@/interface/Customer"
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import SecondStep from '../../../components/checkout-steps/SecondStep'
import ThirdStep from '../../../components/checkout-steps/ThirdStep'
import FourthStep from '../../../components/checkout-steps/FourthStep'
import { validateStep1, validateStep2, validateStep3, validateStep4 } from "@/lib/helpers/CheckoutValidations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { setStepQuery } from "@/lib/helpers/push"
import { useRouter, useSearchParams } from "next/navigation"
import { VivoFibraAPI } from "@/lib/VivoFibraAPI"
import { Switch } from "@/components/ui/switch"

export const checkoutPFPJSchema = z.object({
  fullName: z.string().optional(),
  tel: z.string().optional(),
  email: z.string().optional(),
  mobileLine: z.string().optional(),
  mobileLineNumber: z.string().optional(),
  // step 2
  cep: z.string().optional(),
  homeNumber: z.string().optional(),
  street: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  uf: z.string().optional(),
  liveIn: z.string().optional(),
  complement: z.string().optional(),
  landmark: z.string().optional(),
  floor: z.string().optional(),
  hasBlockAndLot: z.boolean().optional(),
  block: z.string().optional(),
  lot: z.string().optional(),
  // step 3
  dueDay: z.string().optional(),
  primaryDate: z.string().optional(),
  primaryPeriod: z.string().optional(),
  secondaryDate: z.string().optional(),
  secondaryPeriod: z.string().optional(),
  // step 4
  cpf: z.string().optional(),
  bornDate: z.string().optional(),
  primaryTel: z.string().optional(),
  secondaryTel: z.string().optional(),
  termsOfUse: z.boolean().optional(),
  acceptOffers: z.boolean().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutPFPJSchema>

function Index() {
  const vivoFibraAPI = new VivoFibraAPI()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<number>(1)
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const STEPS = {
    1: {
      title: 'Informe seus dados pessoais',
      subtitle: 'Dados pessoais'
    },
    2: {
      title: 'Agora, você precisa completar o endereço',
      subtitle: 'Endereço de entrega do Chip'
    },
    3: {
      title: '',
      subtitle: 'Fatura Digital'
    },
    4: {
      title: 'Informe seus dados pessoais',
      subtitle: 'Dados pessoais'
    }
  } as const
  const dueDate = ['01', '10', '17', '21', '26']
  const form = useForm<CheckoutFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(checkoutPFPJSchema),
    defaultValues: {
      fullName: customerData?.firstStepData?.fullName || '',
      tel: customerData?.firstStepData?.tel || '',
      email: customerData?.firstStepData?.email || '',
      mobileLine: customerData?.firstStepData?.mobileLine || '',
      mobileLineNumber: customerData?.firstStepData?.mobileLineNumber || '',
      //
      cep: customerData?.address?.cep || '',
      homeNumber: customerData?.address?.homeNumber || '',
      street: customerData?.address?.street || '',
      district: customerData?.address?.district || '',
      city: customerData?.address?.city || '',
      uf: customerData?.address?.uf || '',
      liveIn: customerData?.address?.liveIn || '',
      hasBlockAndLot: customerData?.address?.hasBlockAndLot || false,
      block: customerData?.address?.block || '',
      lot: customerData?.address?.lot || '',
      //
      dueDay: customerData?.thirdStepData?.dueDay || '',
      //
      cpf: customerData?.fourthStepData?.cpf || '',
      bornDate: customerData?.fourthStepData?.bornDate || '',
      primaryTel: customerData?.fourthStepData?.primaryTel || '',
      secondaryTel: customerData?.fourthStepData?.secondaryTel || '',
      termsOfUse: customerData?.fourthStepData?.termsOfUse || false,
      acceptOffers: customerData?.fourthStepData?.acceptOffers || false,
    },
  })
  const { handleSubmit, formState: { errors }, setValue, setError, clearErrors, control, register, watch } = form

  const watchMobileLine = watch('mobileLine')

  useEffect(() => {
    const customer = localStorage.getItem('customer')
    if (customer) {
      setCustomerData(JSON.parse(customer))
    }
    setIsLoaded(true)
  }, [step])

  useEffect(() => {
    const customer = localStorage.getItem('customer')
    if (customer) {
      setCustomerData(JSON.parse(customer))
    }

    const urlStep = searchParams.get('step')
    if (urlStep) {
      const stepNumber = parseInt(urlStep)
      if (stepNumber >= 1 && stepNumber <= 4) {
        setStep(stepNumber)
      }
    }

    setIsLoaded(true)
  }, [searchParams])

  useEffect(() => {
    if (!customerData) return

    // Step 1
    if (step === 1) {
      setValue('fullName', customerData?.firstStepData?.fullName || '')
      setValue('tel', customerData?.firstStepData?.tel || '')
      setValue('email', customerData?.firstStepData?.email || '')
      setValue('mobileLine', customerData?.firstStepData?.mobileLine || '')
      setValue('mobileLineNumber', customerData?.firstStepData?.mobileLineNumber || '')
    }

    // Step 2
    if (step === 2) {
      setValue('cep', customerData?.address?.cep || '')
      setValue('homeNumber', customerData?.address?.homeNumber || '')
      setValue('uf', customerData?.address?.uf || '')
      setValue('liveIn', customerData?.address?.liveIn || '')
      setValue('hasBlockAndLot', customerData?.address?.hasBlockAndLot || false)
      setValue('block', customerData?.address?.block || '')
      setValue('lot', customerData?.address?.lot || '')
    }

    // Step 3
    if (step === 3) {
      setValue('dueDay', customerData?.thirdStepData?.dueDay || '')
    }

    // Step 4
    if (step === 4) {
      setValue('cpf', customerData?.fourthStepData?.cpf || '')
      setValue('bornDate', customerData?.fourthStepData?.bornDate || '')
      setValue('primaryTel', customerData?.firstStepData?.tel || '')
      setValue('secondaryTel', customerData?.fourthStepData?.secondaryTel || '')
      setValue('termsOfUse', customerData?.fourthStepData?.termsOfUse || false)
    }
  }, [step, customerData, setValue])

  const onSubmit = async (data: CheckoutFormData) => {
    console.log('entrou')
    let dataToSave

    if (step === 1) {
      const firstStepData = {
        fullName: data.fullName,
        tel: data.tel,
        email: data.email,
        ...(data.mobileLine && { mobileLine: data.mobileLine }),
        ...(data.mobileLineNumber && { mobileLineNumber: data.mobileLineNumber }),
      }
      const isValid = validateStep1(data, form.setError, form.clearErrors)
      if (!isValid) return
      dataToSave = { ...customerData, firstStepData }
      localStorage.setItem('customer', JSON.stringify(dataToSave))
    }

    if (step === 2) {
      const secondStepData = {
        ...customerData?.address,
        cep: data.cep,
        homeNumber: data.homeNumber,
        street: data.street,
        district: data.district,
        city: data.city,
        uf: data.uf,
        liveIn: data.liveIn,
        complement: data.complement,
        ...(data.landmark && { landmark: data.landmark }),
        ...(data.floor && { floor: data.floor }),
        ...(data.block && { landmark: data.block }),
        ...(data.lot && { floor: data.lot }),
      }
      dataToSave = { ...customerData, address: { ...secondStepData } }
      const isValid = validateStep2(data, form.setError, form.clearErrors)
      if (!isValid) return
    }

    if (step === 3) {
      const thirdStepData = {
        dueDay: data.dueDay,
      }
      dataToSave = { ...customerData, thirdStepData }
      const isValid = validateStep3(data, form.setError, form.clearErrors)
      if (!isValid) return
    }

    if (step === 4) {
      const fourthStepData = {
        cpf: data.cpf,
        bornDate: data.bornDate,
        primaryTel: data.primaryTel,
        secondaryTel: data.secondaryTel,
        termsOfUse: data.termsOfUse,
        acceptOffers: data.acceptOffers,
        url: window.location.href
      }
      dataToSave = { ...customerData, fourthStepData }
      const isValid = validateStep4(data, form.setError, form.clearErrors)
      if (!isValid) return
    }

    localStorage.setItem('customer', JSON.stringify(dataToSave))

    const nextStep = (step + 1)
    if (step < 4) {
      setStep(nextStep)
      setStepQuery(nextStep)
    } else {
      try {
        if (!customerData)
          return console.error('>>> dados do cliente não encontrados')

        const response = await vivoFibraAPI.createOrder(customerData)

        console.log(response.disponibilidade)

        if (!response.disponibilidade)
          return router.push(`/pf/unavailable`)

        return router.push(`/pf/available`)
      } catch (error: any) {
        console.log(error)
      }
    }
  }

  if (!isLoaded) return <div className="h-[calc(100vh-76px)] flex justify-center items-center"><Loader className="animate-spin" size={48} color="purple" /></div>

  return (
    <div className="container m-auto px-4 my-12">


      <div className="relative grid gap-4 lg:grid-cols-2">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CheckoutSteps step={step} />
          {(step === 3) && (
            <div className="bg-white p-4 mt-12 rounded-sm shadow-xs">
              <p className="font-light mb-4">Dia de vencimento</p>
              <p className="text-2xl font-semibold text-gray-800">Qual é o dia de vencimento que melhor se adequa a sua necessidade?</p>

              <Controller
                name="dueDay"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    className="flex items-center justify-center my-2 border rounded-sm"
                    onValueChange={field.onChange}
                    value={field.value}>
                    {dueDate.map((date, i) => (
                      <div className="flex items-center justify-center border-x gap-2 grow p-2" key={i}>
                        <RadioGroupItem value={date} id={date} />
                        <Label htmlFor={date} className="text-2xl font-normal">{date}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )} />
              {errors.dueDay && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDay.message}</p>)}
              <p className="font-light mt-2 mb-4 text-sm">*Sua fatura é digital e será enviada por e-mail.</p>
            </div>
          )}
          <div className={`bg-white p-4 rounded-sm shadow-xs ${(step !== 3 ? 'mt-12' : 'mt-4')}`}>
            <div>
              <p className={`font-light mb-4 ${(step === 4) && 'hidden'}`}>{STEPS[step as keyof typeof STEPS].subtitle}</p>
              {(step === 2) && (
                <p className="font-light mb-4 text-sm">
                  É necessário ter alguém no local informado. <a href="#" className="underline text-default-purple">Consulte o prazo de entrega</a>
                </p>
              )}
              <p className={`text-2xl font-semibold text-gray-800 ${(step === 4) && 'hidden'}`}>{STEPS[step as keyof typeof STEPS].title}</p>
              {(step === 3) && (
                <p className="font-light mt-2 mb-4 text-sm">Sua fatura vai chegar apenas neste e-mail, mas pode ser acessada no App Vivo. Você não acumula papel e ainda ganha 3 GB de internet todo mês</p>
              )}
            </div>

            {(step === 1) && (
              <div className="mt-8">
                <div
                  className={`grid gap-4 grid-cols-1 lg:grid-cols-2`}>

                  <div>
                    <Label className="text-1xl font-normal mb-1">Nome Completo</Label>
                    <Controller
                      name="fullName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          value={field.value}
                          onChange={field.onChange} />
                      )}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>)}
                  </div>

                  <div>
                    <Label className="text-1xl font-normal mb-1">Celular</Label>
                    <Controller
                      name="tel"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          value={field.value}
                          onChange={field.onChange}
                          ref={withMask('(99) 9 9999-9999', {
                            placeholder: '',
                            showMaskOnHover: false,
                            showMaskOnFocus: false
                          })} />
                      )} />
                    {errors.tel && (
                      <p className="text-red-500 text-sm mt-1">{errors.tel.message}</p>)}
                  </div>

                  <div className="lg:col-span-2">
                    <Label className="text-1xl font-normal mb-1">E-mail</Label>
                    <Input type="email" {...register('email')} />
                    <span className="opacity-75 text-sm font-light">E-mail para envio da fatura digital.</span>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
                  </div>

                  <div className="lg:col-span-2">
                    <p className="text-2xl font-semibold text-gray-800">Como você quer contratar seu plano Vivo Controle?</p>
                  </div>
                  <div className={`${watchMobileLine !== 'newNumber' ? '' : 'lg:col-span-2'}`}>
                    <Label className="text-sm font-normal mb-1 mt-4">Escolha uma das opções</Label>
                    <Controller
                      name="mobileLine"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="mobileLine" className="w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newNumber">
                              Adquirir um novo número Vivo
                            </SelectItem>
                            <SelectItem value="transferNumber">
                              Transferir meu número pra Vivo
                            </SelectItem>
                            <SelectItem value="keepNumber">
                              Manter meu número Vivo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )} />
                    {errors.mobileLine && (
                      <p className="text-red-500 text-sm mt-1">{errors.mobileLine.message}</p>)}
                  </div>

                  {(watchMobileLine === 'transferNumber' ||
                    watchMobileLine === 'keepNumber') && (
                      <div>
                        <Label className="text-sm font-normal mb-1 mt-4">Número</Label>
                        <Controller
                          name='mobileLineNumber'
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              value={field.value}
                              onChange={field.onChange}
                              ref={withMask('(99) 9 9999-9999', {
                                placeholder: '(00) 0 0000-0000',
                                showMaskOnHover: false,
                                showMaskOnFocus: false
                              })} />
                          )} />
                        {errors.mobileLineNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.mobileLineNumber.message}</p>)}
                      </div>
                    )}

                  {(watchMobileLine !== 'newNumber') && (
                    <p className="text-xs opacity-75 font-light lg:col-span-2">{watchMobileLine === 'transferNumber' ?
                      'Para essa opção, é necessário que o número esteja cadastrado no mesmo CPF informado nos dados pessoais. Você irá receber um SMS do remetente 7678 para confirmar sua portabilidade. Responda "SIM" do seu telefone atual em até 24 horas para aprovar. Após receber o chip Vivo, faça uma ligação para ativá-lo. Somente após essa ativação é que o prazo de 3 dias úteis para a conclusão da portabilidade começará a ser contado.' :
                      'Para essa opção, é necessário que o número esteja cadastrado no mesmo CPF informado nos dados pessoais. Você não precisa cancelar o seu plano atual pois a Vivo fará os processos necessários para a troca do plano.'}</p>
                  )}

                  <div className="col-span-2">
                    <div>
                      <p className="font-light">Chip virtual</p>
                      <p className="text-xs opacity-75 font-light mb-4">O <span className="font-bold">eSIM</span> substitui o chip físico e é prático e seguro. Vamos enviar as instruções de ativação por e-mail, é só seguir as etapas</p>
                    </div>
                    <div className="flex items-center gap-2 p-4 border rounded-sm">
                      <Switch checked/>
                      <Label className="text-sm font-normal">eSim</Label>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {(step === 2) && (
              <SecondStep customerData={customerData} form={form} step={step} />)}

            {(step === 3) && (<ThirdStep form={form} customerData={customerData} />)}

            {(step === 4) && (<FourthStep form={form} />)}

            <Button
              variant={'vivo'}
              className="w-full py-7 rounded-sm text-1xl text-white mt-4"
              type="submit">
              Avançar
            </Button>
          </div>
        </form>

        <div className="bg-white p-4 rounded-sm py-8 h-max shadow-xs">
          <p className="text-2xl font-semibold text-gray-800 mb-4">Meu plano</p>

          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-light"> <Wifi size={18} /> {customerData?.plan?.plan} {customerData?.plan?.fibra}</p>

            <p className="font-light">
              {customerData?.plan?.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="flex items-center gap-2 font-light">Total</p>

            <p className="font-light">
              {customerData?.plan?.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês</p>
          </div>
        </div>

      </div>

    </div >
  )
}

export default Index