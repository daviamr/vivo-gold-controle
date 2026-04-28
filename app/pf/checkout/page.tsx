'use client'

import { Suspense, useEffect, useState } from "react"
import CheckoutSteps from '../../../components/checkout-steps/CheckoutSteps'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { withMask } from "use-mask-input"
import { Button } from "@/components/ui/button"
import { Loader, Smartphone } from "lucide-react"
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
  eSim: z.boolean().optional(),
  ddi: z.string().optional(),
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
  ddiAdditional: z.string().optional(),
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
      eSim: customerData?.firstStepData?.eSim || true,
      ddi: customerData?.firstStepData?.ddi || '+55',
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
      ddiAdditional: customerData?.fourthStepData?.ddiAdditional || '+55',
      termsOfUse: customerData?.fourthStepData?.termsOfUse || false,
      acceptOffers: customerData?.fourthStepData?.acceptOffers || false,
    },
  })
  const { formState: { errors }, setValue, control, register, watch } = form
  const DDI_OPTIONS = [
    { label: '🇧🇷 +55', value: '+55', mask: '(99) 9 9999-9999' },  // ← sem +55
    { label: '🇺🇸 +1', value: '+1', mask: '(999) 999-9999' },    // ← sem +1
    { label: '🇬🇧 +44', value: '+44', mask: '99 9999 9999' },       // ← sem +44
    { label: '🇵🇹 +351', value: '+351', mask: '999 999 999' },        // ← sem +351
  ];

  const eSim = watch('eSim')
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
      setValue('eSim', customerData?.firstStepData?.eSim || true)
      setValue('ddi', customerData?.firstStepData?.ddi || '+55')
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
      setValue('ddi', customerData?.firstStepData?.ddi || '+55')
      setValue('primaryTel', customerData?.firstStepData?.tel || '')
      setValue('secondaryTel', customerData?.fourthStepData?.secondaryTel || '')
      setValue('ddiAdditional', customerData?.fourthStepData?.ddiAdditional || '+55')
      setValue('termsOfUse', customerData?.fourthStepData?.termsOfUse || false)
    }
  }, [step, customerData, setValue])

  const ensureOrderId = async (cust: Customer | null): Promise<number | undefined> => {
    if (cust?.orderId) return cust.orderId
    if (!cust?.plan) return undefined
    try {
      const res = await vivoFibraAPI.saveConsultOrder(
        cust.plan,
        cust.firstStepData?.mobileLine,
      )
      return VivoFibraAPI.extractOrderId(res)
    } catch (e) {
      console.error('Erro ao registrar pedido (consulta):', e)
      return undefined
    }
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (!customerData) {
      console.error('Dados do cliente não encontrados')
      return
    }

    const orderId = customerData.orderId ?? (await ensureOrderId(customerData))
    if (!orderId) {
      form.setError('email', {
        message: 'Não foi possível sincronizar o pedido. Volte e selecione o plano novamente.',
      })
      return
    }

    let dataToSave: Customer = { ...customerData, orderId }

    try {
      if (step === 1) {
        const isValid = await validateStep1(data, form.setError, form.clearErrors)
        if (!isValid) return

        const firstStepData = {
          fullName: data.fullName!,
          tel: data.tel!,
          email: data.email!,
          mobileLine: data.mobileLine,
          mobileLineNumber: data.mobileLineNumber,
          eSim: data.eSim,
          ddi: data.ddi
        }
        dataToSave = { ...customerData, firstStepData, orderId }
        await vivoFibraAPI.updateOrderProgress(
          orderId,
          vivoFibraAPI.buildStep1Payload({
            fullName: firstStepData.fullName,
            tel: firstStepData.tel,
            email: firstStepData.email,
            mobileLine: firstStepData.mobileLine,
            mobileLineNumber: firstStepData.mobileLineNumber,
            eSim: firstStepData.eSim,
            ddi: firstStepData.ddi,
          }),
        )
        localStorage.setItem('customer', JSON.stringify(dataToSave))
        const nextStep = step + 1
        setStep(nextStep)
        setStepQuery(nextStep)
        return
      }

      if (step === 2) {
        const isValid = validateStep2(data, form.setError, form.clearErrors)
        if (!isValid) return

        const secondStepData = {
          ...(customerData.address ?? {}),
          cep: data.cep!,
          homeNumber: data.homeNumber!,
          street: data.street,
          district: data.district,
          city: data.city,
          uf: data.uf,
          liveIn: data.liveIn,
          complement: data.complement,
          landmark: data.landmark,
          floor: data.floor,
          hasBlockAndLot: data.hasBlockAndLot,
          block: data.block,
          lot: data.lot,
        }
        dataToSave = { ...customerData, address: secondStepData as Customer["address"], orderId }
        await vivoFibraAPI.updateOrderProgress(
          orderId,
          vivoFibraAPI.buildStep2Payload(secondStepData as Customer["address"]),
        )
        localStorage.setItem('customer', JSON.stringify(dataToSave))
        const nextStep = step + 1
        setStep(nextStep)
        setStepQuery(nextStep)
        return
      }

      if (step === 3) {
        const isValid = validateStep3(data, form.setError, form.clearErrors)
        if (!isValid) return

        const thirdStepData = {
          dueDay: data.dueDay!,
          primaryDate: customerData.thirdStepData?.primaryDate ?? "",
          primaryPeriod: customerData.thirdStepData?.primaryPeriod ?? "",
          secondaryDate: customerData.thirdStepData?.secondaryDate,
          secondaryPeriod: customerData.thirdStepData?.secondaryPeriod,
        }
        dataToSave = { ...customerData, thirdStepData, orderId }
        await vivoFibraAPI.updateOrderProgress(orderId, vivoFibraAPI.buildStep3Payload(data.dueDay!))
        localStorage.setItem('customer', JSON.stringify(dataToSave))
        const nextStep = step + 1
        setStep(nextStep)
        setStepQuery(nextStep)
        return
      }

      if (step === 4) {
        const isValid = validateStep4(data, form.setError, form.clearErrors)
        if (!isValid) return

        const fourthStepData = {
          cpf: data.cpf!,
          bornDate: data.bornDate!,
          motherName: customerData.fourthStepData?.motherName ?? "",
          primaryTel: data.primaryTel!,
          secondaryTel: data.secondaryTel,
          ddiAdditional: data.ddiAdditional,
          termsOfUse: data.termsOfUse,
          acceptOffers: data.acceptOffers,
          url: window.location.href
        }
        const orderNumber = VivoFibraAPI.generateClientOrderNumber()
        dataToSave = { ...customerData, fourthStepData, orderId }
        const response = await vivoFibraAPI.updateOrderProgress(
          orderId,
          vivoFibraAPI.buildStep4Payload({
            cpf: fourthStepData.cpf,
            bornDate: fourthStepData.bornDate,
            primaryTel: fourthStepData.primaryTel,
            secondaryTel: fourthStepData.secondaryTel,
            ddi: data.ddi,
            ddiAdditional: data.ddiAdditional,
            termsOfUse: fourthStepData.termsOfUse,
            acceptOffers: fourthStepData.acceptOffers,
            orderNumber,
          }),
        )
        const orderNumberFromApi = VivoFibraAPI.extractOrderNumber(response)
        const finalCustomer: Customer = {
          ...dataToSave,
          orderNumber: orderNumberFromApi ?? orderNumber,
        }
        localStorage.setItem('customer', JSON.stringify(finalCustomer))
        return router.push(`/pf/available`)
      }
    } catch (error: unknown) {
      console.error('Erro ao salvar etapa no servidor:', error)
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
                    <div className="flex gap-2">

                      {/* Controller do DDI */}
                      <Controller
                        name="ddi"
                        control={control}
                        render={({ field }) => {
                          const currentMask = DDI_OPTIONS.find(d => d.value === field.value)?.mask ?? '(99) 9 9999-9999';

                          return (
                            <>
                              <Select
                                key={field.value}
                                value={field.value}
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  setValue('tel', '');
                                }}>
                                <SelectTrigger className="w-[110px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {DDI_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {/* Controller do Tel usando a máscara do DDI atual */}
                              <Controller
                                name="tel"
                                control={control}
                                render={({ field: telField }) => (
                                  <Input
                                    type="text"
                                    value={telField.value ?? ''}
                                    onChange={(e) => telField.onChange(e.target.value)}
                                    onBlur={telField.onBlur}
                                    ref={withMask(currentMask, {
                                      placeholder: '',
                                      showMaskOnHover: false,
                                      showMaskOnFocus: false,
                                    })}
                                  />
                                )}
                              />
                            </>
                          );
                        }}
                      />

                    </div>
                    {errors.tel && <p className="text-red-500 text-sm mt-1">{errors.tel.message}</p>}
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
                        <Select
                          key={field.value}
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger id="mobileLine" className="w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new_number">
                              Adquirir um novo número Vivo
                            </SelectItem>
                            <SelectItem value="port_in_to_vivo">
                              Transferir meu número pra Vivo
                            </SelectItem>
                            <SelectItem value="keep_vivo_number">
                              Manter meu número Vivo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )} />
                    {errors.mobileLine && (
                      <p className="text-red-500 text-sm mt-1">{errors.mobileLine.message}</p>)}
                  </div>

                  {(watchMobileLine === 'port_in_to_vivo' ||
                    watchMobileLine === 'keep_vivo_number') && (
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
                      <Controller
                        name='eSim'
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )} />
                      <Label className="text-sm font-normal">eSim</Label>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {(step === 2) && (
              <SecondStep customerData={customerData} form={form} step={step} />)}

            {(step === 3) && (<ThirdStep form={form} customerData={customerData} />)}

            {(step === 4) && (<FourthStep form={form} ddiOptions={DDI_OPTIONS} />)}

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

          <div className="flex items-center justify-between border-b pb-4">
            <p className="flex items-center gap-2 font-light"> <Smartphone size={18} /> {customerData?.plan?.name}</p>

            <p className="font-light">
              {customerData?.plan?.pricing?.base_monthly?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês</p>
          </div>

          {eSim && (
            <div className="flex items-center justify-between border-b py-4">
              <p className="flex items-center gap-2 font-bold">Chip 4.5G</p>

              <p className="font-bold uppercase">
                Grátis</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="flex items-center gap-2 font-light">Total</p>

            <p className="font-light">
              {customerData?.plan?.pricing.base_monthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês</p>
          </div>
        </div>

      </div>

    </div >
  )
}

function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-76px)] flex justify-center items-center">
        <Loader className="animate-spin" size={48} color="purple" />
      </div>
    }>
      <Index />
    </Suspense>
  )
}

export default CheckoutPage