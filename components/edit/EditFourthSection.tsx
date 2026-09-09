"use client"

import { withMask } from "use-mask-input"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PhoneField from "./PhoneField"
import type { EditFormData } from "./edit-form"
import { withPartnerPath } from "@/lib/partner-hash"

type Props = {
  form: EditFormData
  onChange: (field: keyof EditFormData, value: string | boolean) => void
  errors?: Partial<Record<keyof EditFormData, string>>
}

export default function EditFourthSection({ form, onChange, errors = {} }: Props) {
  return (
    <div className="grid gap-4 my-4 lg:grid-cols-2">
      <div>
        <Label htmlFor="edit-cpf" className="text-1xl font-normal mb-1">CPF</Label>
        <Input
          id="edit-cpf"
          type="text"
          value={form.cpf}
          onChange={(e) => onChange("cpf", e.target.value)}
          ref={withMask("999.999.999-99", {
            placeholder: "_",
            showMaskOnHover: false,
            showMaskOnFocus: false,
          })}
        />
        {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
      </div>

      <div>
        <Label htmlFor="edit-bornDate" className="text-1xl font-normal mb-1">Data de Nascimento</Label>
        <Input
          id="edit-bornDate"
          type="text"
          placeholder="dd/mm/aaaa"
          value={form.bornDate}
          onChange={(e) => onChange("bornDate", e.target.value)}
          ref={withMask("99/99/9999", {
            placeholder: "_",
            showMaskOnHover: false,
            showMaskOnFocus: false,
          })}
        />
        {errors.bornDate && <p className="text-red-500 text-sm mt-1">{errors.bornDate}</p>}
      </div>

      <div className="lg:col-span-2">
        <p className="text-2xl font-semibold text-gray-800 mb-4">Confirmação via SMS</p>
        <p className="font-light text-[13px]">
          <span className="font-bold text-red-700">IMPORTANTE!</span> O SMS para realização da biometria será enviado ao número informado abaixo:
        </p>
      </div>

      <div className="lg:col-span-2">
        <Label htmlFor="edit-primaryTel" className="text-1xl font-normal mb-1">Telefone Principal</Label>
        <PhoneField
          id="edit-primaryTel"
          ddi={form.ddi}
          value={form.primaryTel}
          onDdiChange={(ddi) => onChange("ddi", ddi)}
          onValueChange={(tel) => {
            onChange("primaryTel", tel)
            onChange("tel", tel)
          }}
          error={errors.primaryTel}
        />
      </div>

      <span className="text-[13px] font-light lg:col-span-2">
        Se desejar, adicione um segundo número de contato para garantir o recebimento da mensagem
      </span>

      <div className="lg:col-span-2">
        <Label htmlFor="edit-secondaryTel" className="text-1xl font-normal mb-1">
          Segundo número de contato (opcional)
        </Label>
        <PhoneField
          id="edit-secondaryTel"
          ddi={form.ddiAdditional}
          value={form.secondaryTel}
          onDdiChange={(ddi) => onChange("ddiAdditional", ddi)}
          onValueChange={(tel) => onChange("secondaryTel", tel)}
          error={errors.secondaryTel}
        />
      </div>

      <div className="grid gap-2 px-2 mb-2 lg:col-span-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="edit-termsOfUse"
            checked={form.termsOfUse}
            onCheckedChange={(checked) => {
              onChange("termsOfUse", checked === "indeterminate" ? false : checked)
            }}
          />
          <label
            htmlFor="edit-termsOfUse"
            className={`font-normal text-sm ${errors.termsOfUse ? "text-red-500 underline" : ""}`}>
            Aceito os <a href={withPartnerPath("/termos-de-uso")} target="_blank" rel="noopener noreferrer" className="underline">Termos e Condições de Uso</a>.
          </label>
        </div>
        {errors.termsOfUse && <p className="text-red-500 text-sm">{errors.termsOfUse}</p>}

        <div className="flex items-center gap-2">
          <Checkbox
            id="edit-acceptOffers"
            checked={form.acceptOffers}
            onCheckedChange={(checked) => {
              onChange("acceptOffers", checked === "indeterminate" ? false : checked)
            }}
          />
          <label htmlFor="edit-acceptOffers" className="font-normal text-sm">
            Aceito receber comunicações e ofertas da Vivo e Parceiros.
          </label>
        </div>
      </div>
    </div>
  )
}
