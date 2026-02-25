'use client'
import { withMask } from "use-mask-input"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import { useEffect, useState } from "react"
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from "react-hook-form"
import { Button } from "../ui/button"
import { ViaCEP, ViaCepResponse } from "@/lib/ViaCEP"
import { cleanNumbers } from "@/lib/helpers/formatters"
import DefaultModal from '../default-modal/DefaultModal'

export const cepSchema = z.object({
  cep: z
    .string()
    .min(1, 'Informe um CEP válido.')
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido. Use o formato 00000-000'),
  homeNumber: z.string().min(1, 'Informe o número da residência ou indique que não há número.'),
  typeInstalation: z.enum(['casa', 'empresa'])
})

export type CepFormData = z.infer<typeof cepSchema>

function Index() {
  const [withoutNumber, setWithoutNumber] = useState(false)
  const [loading, setLoading] = useState(false)
  const [CEPData, setCEPData] = useState<ViaCepResponse | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const viaCEP = new ViaCEP()

  const form = useForm<CepFormData>({
    resolver: zodResolver(cepSchema),
    defaultValues: { cep: '', homeNumber: '', typeInstalation: 'casa' },
  })
  const { handleSubmit, formState: { errors }, setValue, setError, watch, control } = form
  const lengthCEP = watch('cep')

  const buscarCep = async (cep: string) => {
    setLoading(true)
    try {
      const response = await viaCEP.searchCEP(cep)

      if (response?.erro) {
        setError('cep', {
          type: 'manual',
          message: 'Informe um CEP válido'
        })
        setCEPData(null)
        return
      }

      setCEPData(response)
    } catch (error) {
      console.log('Erro:', error)
      setCEPData(null)
    } finally {
      setLoading(false)
    }
  }

  const onFormSubmit = async (data: CepFormData) => {
    if (!CEPData) return setError('cep', { type: 'manual', message: 'Informe um CEP válido' })
    setLoading(true)

    try {
      localStorage.setItem('customer', JSON.stringify({ address: { ...data, ...CEPData } }))
    } catch (error: any) {
      console.log('error on send', error)
    } finally {
      setLoading(false)
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (withoutNumber) {
      setValue('homeNumber', 'S/N')
    } else {
      setValue('homeNumber', '')
    }
  }, [withoutNumber, setValue])

  useEffect(() => {
    const cleanCEP = cleanNumbers(lengthCEP || '')

    if (cleanCEP.length === 8) {
      buscarCep(cleanCEP)
    }
  }, [lengthCEP])

  return (
    <DefaultModal bgBlack={true} isOpen={isOpen}>
      <div className="w-full grid max-w-125 bg-default-purple rounded-sm lg:grid-cols-2 lg:flex-row lg:items-center lg:max-w-275">

        <div
          className="px-4 py-14">
          <p className='max-w-90 m-auto text-white text-[26px] text-center font-light lg:text-3xl lg:max-w-120'>Consulte os planos disponíveis para sua região</p>
        </div>

        <div className='bg-white p-8 font-light rounded-b-sm lg:rounded-b-none lg:rounded-br-sm lg:rounded-tr-sm lg:py-20'>
          <h1 className='text-xl mb-4 lg:text-2xl lg:font-normal lg:max-w-100'>Precisamos de alguns dados para continuar</h1>

          {/*form*/}
          <form className="px-2" onSubmit={handleSubmit(onFormSubmit)}>
            <div className='flex flex-col gap-2 mb-8 lg:flex-row'>
              <h2 className='text-lg'>Buscar planos para:</h2>

              <Controller
                name="typeInstalation"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="lg:flex lg:flex-row lg:gap-6">
                    <div className="flex items-center gap-2 lg:ml-4">
                      <RadioGroupItem value="casa" id="r1" />
                      <Label htmlFor="r1" className="font-light text-1xl">Minha Casa</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="empresa" id="r2" />
                      <Label htmlFor="r2" className="font-light text-1xl">Minha Empresa</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <span className="opacity-75 text-sm">* Digite o CEP de onde deseja instalar a Vivo Fibra.</span>
            <div className="grid gap-4 my-4 font-normal lg:grid-cols-2">
              <div>
                <Controller
                  name="cep"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="CEP"
                      maxLength={9}
                      value={field.value}
                      onChange={field.onChange}
                      ref={withMask('99999-999', {
                        placeholder: '_',
                        showMaskOnHover: false,
                        showMaskOnFocus: false
                      })}
                    />
                  )}
                />
                {errors.cep && (
                  <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {withoutNumber ? (
                  <Controller
                    name="homeNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="S/N"
                        value="S/N"
                        disabled
                        onChange={field.onChange}
                      />
                    )}
                  />
                ) : (
                  <Controller
                    name="homeNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Número da Residência"
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        ref={withMask('999999', {
                          placeholder: '',
                          showMaskOnHover: false,
                          showMaskOnFocus: false
                        })}
                      />
                    )}
                  />
                )}
                {errors.homeNumber && (
                  <p className="text-red-500 text-sm">{errors.homeNumber.message}</p>
                )}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="withoutNumber"
                    checked={withoutNumber}
                    onCheckedChange={(checked) => setWithoutNumber(checked as boolean)}
                  />
                  <Label htmlFor="withoutNumber" className="opacity-75 text-nowrap">Sem número</Label>
                </div>
              </div>

              {(CEPData) && (
                <div className="border-2 rounded-sm border-default-purple p-4 lg:col-span-2">
                  <p className="flex items-center gap-2 text-2xl text-center">{CEPData.logradouro} &bull; {CEPData.bairro} &bull; {CEPData.localidade}</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant={'vivo'}
              className="w-full text-white text-1xl font-bold py-8 mt-4"
              disabled={loading}>
              {loading ? 'Carregando...' : 'Consultar Planos Vivo Fibra'}
            </Button>
          </form>

        </div>

      </div>
    </DefaultModal>
  )
}

export default Index