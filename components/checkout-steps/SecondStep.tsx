'use client'

import { Label } from "../ui/label";
import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { withMask } from "use-mask-input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { useEffect } from "react";
import { Customer } from "@/interface/Customer";

function Index({ customerData, form, step }: SecondStepProps) {
  const { formState: { errors }, setValue, control, register, watch } = form
  const watchLiveIn = watch('liveIn')
  const watchHasBlockAndLot = watch('hasBlockAndLot')

  useEffect(() => {
    if (step === 2 && customerData?.address) {
      setValue('cep', customerData.address.cep || '')
      setValue('homeNumber', customerData.address.homeNumber || '')
      setValue('street', customerData.address.logradouro || '')
      setValue('district', customerData.address.bairro || '')
      setValue('city', customerData.address.localidade || '')
      setValue('uf', customerData.address.uf || '')
    }
  }, [])

  return (
    <div className="mt-8">
      <div className="grid gap-4 lg:grid-cols-2">

        <div>
          <Label className="text-1xl font-normal mb-1">CEP</Label>
          <Controller
            name="cep"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="CEP"
                value={field.value || ''}
                onChange={field.onChange}
                maxLength={9}
                ref={withMask('99999-999', {
                  placeholder: '_',
                  showMaskOnHover: false,
                  showMaskOnFocus: false
                })} />
            )}
          />
          {errors.cep && (
            <p className="text-red-500 text-sm mt-1">{String(errors.cep.message)}</p>)}
        </div>

        <div>
          <Label className="text-1xl font-normal mb-1" htmlFor="homeNumber">Número</Label>
          <Input type="text" id="homeNumber" {...register('homeNumber')} />
          {errors.homeNumber && (
            <p className="text-red-500 text-sm mt-1">{String(errors.homeNumber.message)}</p>)}
        </div>

        <span className="flex items-center gap-2 text-sm lg:col-span-2">
          <Controller
            name="hasBlockAndLot"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="hasBlockAndLot"
                checked={field.value}
                onCheckedChange={field.onChange} />
            )} /> Quero informar quadra e lote
        </span>

        {watchHasBlockAndLot && (
          <>
            <div>
              <Label className="text-1xl font-normal mb-1" htmlFor="block">Quadra</Label>
              <Input type="text" id="block" {...register('block')} />
              {errors.block && (
                <p className="text-red-500 text-sm mt-1">{String(errors.block.message)}</p>)}
            </div>
            <div>
              <Label className="text-1xl font-normal mb-1" htmlFor="lot">Lote</Label>
              <Input type="text" id="lot" {...register('lot')} />
              {errors.lot && (
                <p className="text-red-500 text-sm mt-1">{String(errors.lot.message)}</p>)}
            </div>
          </>
        )}

        <div className="lg:col-span-2">
          <Label className="text-1xl font-normal mb-1" htmlFor="street">Endereço</Label>
          <Input type="text" id="street" {...register('street')} />
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{String(errors.street.message)}</p>)}
        </div>

        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-3">
          <div>
            <Label className="text-1xl font-normal mb-1" htmlFor="district">Bairro</Label>
            <Input type="text" id="district" {...register('district')} />
            {errors.district && (
              <p className="text-red-500 text-sm mt-1">{String(errors.district.message)}</p>)}
          </div>

          <div>
            <Label className="text-1xl font-normal mb-1" htmlFor="city">Cidade</Label>
            <Input type="text" id="city" {...register('city')} />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{String(errors.city.message)}</p>)}
          </div>

          <div>
            <Label className="text-1xl font-normal mb-1" htmlFor="uf">Estado</Label>
            <Input type="text" id="uf" {...register('uf')} maxLength={2} />
            {errors.uf && (
              <p className="text-red-500 text-sm mt-1">{String(errors.uf.message)}</p>)}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-2xl">Você mora em:</p>
          <Controller
            name="liveIn"
            control={control}
            render={({ field }) => (
              <RadioGroup
                className="flex items-center gap-4 px-4 my-2 lg:px-0"
                onValueChange={field.onChange}
                value={field.value}>
                <div className="flex items-center gap-2 lg:ml-4">
                  <RadioGroupItem value="building" id="building" />
                  <Label htmlFor="building" className="font-light text-1xl">Edifício</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="house" id="house" />
                  <Label htmlFor="house" className="font-light text-1xl">Casa</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.liveIn && (
            <p className="text-red-500 text-sm mt-1">{String(errors.liveIn.message)}</p>)}
        </div>

        <div>
          <Label className="text-1xl font-normal mb-1">Complemento completo</Label>
          <Input type="text" placeholder="Ex: Bloco B" {...register('complement')} />
          {errors.complement && (
            <p className="text-red-500 text-sm mt-1">{String(errors.complement.message)}</p>)}
          <span className="opacity-75 text-sm font-light">{watchLiveIn === 'house' ? 'Opcional' : 'Obrigatório'}</span>
        </div>

        <div>
          <Label
            className="text-1xl font-normal mb-1">{watchLiveIn === 'house' ? 'Ponto de Referência' : 'Andar'}</Label>
          <Input
            type="text"
            placeholder={watchLiveIn === 'house' ? 'Ex: Próximo ao Mercado' : 'Ex: 301'}
            {...register(watchLiveIn === 'house' ? 'landmark' : 'floor')} />
          {errors.floor && (
            <p className="text-red-500 text-sm mt-1">{String(errors.floor.message)}</p>)}
          <span className="opacity-75 text-sm font-light">{watchLiveIn === 'house' ? 'Opcional' : 'Obrigatório'}</span>
        </div>

        <div className="lg:col-span-2 mt-2">
          <p className="text-sm">
            Pacote de TV
          </p>
          <p className="text-lg mb-2 font-bold">
            Que tal adicionar um pacote de TV no seu plano?
          </p>
          <Controller
            name="TVPlan"
            control={control}
            render={({ field }) => (
              <RadioGroup
                className="flex items-center gap-4 px-4 my-2 lg:px-0"
                onValueChange={field.onChange}
                value={field.value}>
                <div className="flex items-center gap-2 lg:ml-4">
                  <RadioGroupItem value="want" id="want" />
                  <Label htmlFor="want" className="font-light text-1xl">Sim, quero adicionar um pacote de TV</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="dontWant" id="dontWant" />
                  <Label htmlFor="dontWant" className="font-light text-1xl">Por enquanto não tenho interesse</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.TVPlan && (
            <p className="text-red-500 text-sm mt-1">{String(errors.TVPlan.message)}</p>)}
        </div>


      </div>
    </div>
  )
}

export default Index

type SecondStepProps = {
  customerData: Customer | null,
  form: UseFormReturn<any>,
  step: number
}