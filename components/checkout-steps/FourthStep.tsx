'use client'

import { withMask } from "use-mask-input";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Controller, UseFormReturn } from "react-hook-form";

function Index({ form }: SecondStepProps) {
  const { formState: { errors }, control } = form

  return (
    <div className="mt-8">
      <div className="grid gap-4 lg:grid-cols-2">

        <div>
          <Label className="text-1xl font-normal mb-1" htmlFor="cpf">CPF</Label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <Input
                id="cpf"
                type="text"
                value={field.value || ''}
                onChange={field.onChange}
                ref={withMask('999.999.999-99', {
                  placeholder: '_',
                  showMaskOnHover: false,
                  showMaskOnFocus: false
                })} />
            )}
          />
          {errors.cpf && (
            <p className="text-red-500 text-sm mt-1">{String(errors.cpf.message)}</p>)}
        </div>

        <div>
          <Label className="text-1xl font-normal mb-1" htmlFor="bornDate">Data de Nascimento</Label>
          <Controller
            name="bornDate"
            control={control}
            render={({ field }) => (
              <Input
                id="bornDate"
                type="text"
                placeholder="dd/mm/aaaa"
                value={field.value || ''}
                onChange={field.onChange}
                ref={withMask('99/99/9999', {
                  placeholder: '_',
                  showMaskOnHover: false,
                  showMaskOnFocus: false
                })} />
            )} />
          {errors.bornDate && (
            <p className="text-red-500 text-sm mt-1">{String(errors.bornDate.message)}</p>)}
        </div>

        <div className="lg:col-span-2">
          <p className="text-2xl font-semibold text-gray-800 mb-4">Confirmação via SMS</p>
          <p className="font-light text-[13px]"><span className="font-bold text-red-700">IMPORTANTE!</span> O SMS para realização da biometria será enviado ao número informado abaixo:</p>
        </div>

        <div className="lg:col-span-2">
          <Label className="text-1xl font-normal mb-1" htmlFor="primaryTel">Telefone Principal</Label>
          <Controller
            name="primaryTel"
            control={control}
            render={({ field }) => (
              <Input
                id="primaryTel"
                type="text"
                value={field.value || ''}
                onChange={field.onChange}
                ref={withMask('(99) 9 9999-9999', {
                  placeholder: '',
                  showMaskOnHover: false,
                  showMaskOnFocus: false
                })} />
            )} />
          {errors.primaryTel && (
            <p className="text-red-500 text-sm mt-1">{String(errors.primaryTel.message)}</p>)}
        </div>
        <span className="text-[13px] font-light lg:col-span-2">Se desejar, adicione um segundo número de contato para garantir o recebimento da mensagem</span>

        <div className="lg:col-span-2">
          <Label className="text-1xl font-normal mb-1" htmlFor="secondaryTel">Segundo número de contato (opcional)</Label>
          <Controller
            name="secondaryTel"
            control={control}
            render={({ field }) => (
              <Input
                id="secondaryTel"
                type="text"
                value={field.value || ''}
                onChange={field.onChange}
                ref={withMask('(99) 9 9999-9999', {
                  placeholder: '',
                  showMaskOnHover: false,
                  showMaskOnFocus: false
                })} />
            )} />
          {errors.secondaryTel && (
            <p className="text-red-500 text-sm mt-1">{String(errors.secondaryTel.message)}</p>)}
        </div>
        <span className="text-[13px] font-light lg:col-span-2">O benefício de cortesia da Amazon Prime é válido por 6 meses a partir da ativação da assinatura. Após esse período, será cobrado o valor de R$13,90/mês no plano anual.</span>

        <div className="grid gap-2 px-2 mb-2 lg:col-span-2">

          <div className="flex items-center gap-2">
            <Controller
              name="termsOfUse"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="termsOfUse"
                  checked={field.value}
                  onCheckedChange={field.onChange} />
              )} />
            <label htmlFor="termsOfUse" className={`font-normal text-sm ${errors.termsOfUse ? 'text-red-500 underline' : ''}`}>Aceito os <span className="underline">Termos e Condições de Uso</span>.</label>
          </div>


          <div className="flex items-center gap-2">
            <Controller
              name="acceptOffers"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="acceptOffers"
                  checked={field.value}
                  onCheckedChange={field.onChange} />
              )} />
            <label htmlFor="acceptOffers" className="font-normal text-sm">Aceito receber comunicações e ofertas da Vivo e Parceiros.</label>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Index

type SecondStepProps = {
  form: UseFormReturn<any>,
}