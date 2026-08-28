"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PhoneField from "./PhoneField"
import type { EditFormData } from "./edit-form"
import { withMask } from "use-mask-input"

export type EditFirstSectionFormData = Pick<
  EditFormData,
  "fullName" | "tel" | "ddi" | "email" | "mobileLine" | "mobileLineNumber" | "eSim"
>

type Props = {
  form: EditFormData
  onChange: (field: keyof EditFormData, value: string | boolean) => void
  errors?: Partial<Record<keyof EditFormData, string>>
}

export default function EditFirstSection({ form, onChange, errors = {} }: Props) {
  const showLineNumber = form.mobileLine === "port_in_to_vivo" || form.mobileLine === "keep_vivo_number"

  return (
    <div className="grid gap-4 my-4 lg:grid-cols-2">
      <div>
        <Label htmlFor="edit-fullName" className="text-1xl font-normal mb-1">Nome Completo</Label>
        <Input
          type="text"
          id="edit-fullName"
          value={form.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <Label htmlFor="edit-tel" className="text-1xl font-normal mb-1">Celular</Label>
        <PhoneField
          id="edit-tel"
          ddi={form.ddi}
          value={form.tel}
          onDdiChange={(ddi) => onChange("ddi", ddi)}
          onValueChange={(tel) => onChange("tel", tel)}
          error={errors.tel}
        />
      </div>

      <div className="lg:col-span-2">
        <Label htmlFor="edit-email" className="text-1xl font-normal mb-1">E-mail</Label>
        <Input
          type="email"
          id="edit-email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        <span className="opacity-75 text-sm font-light">E-mail para envio da fatura digital.</span>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="lg:col-span-2">
        <p className="text-2xl font-semibold text-gray-800">Como você quer contratar seu plano Vivo Controle?</p>
      </div>

      <div>
        <Label className="text-sm font-normal mb-1 mt-4">Escolha uma das opções</Label>
        <Select value={form.mobileLine} onValueChange={(value) => onChange("mobileLine", value)}>
          <SelectTrigger id="edit-mobileLine" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new_number">Adquirir um novo número Vivo</SelectItem>
            <SelectItem value="port_in_to_vivo">Transferir meu número pra Vivo</SelectItem>
            <SelectItem value="keep_vivo_number">Manter meu número Vivo</SelectItem>
          </SelectContent>
        </Select>
        {errors.mobileLine && <p className="text-red-500 text-sm mt-1">{errors.mobileLine}</p>}
      </div>

      {showLineNumber && (
        <div>
          <Label htmlFor="edit-mobileLineNumber" className="text-sm font-normal mb-1 mt-4">Número</Label>
          <Input
            id="edit-mobileLineNumber"
            type="text"
            value={form.mobileLineNumber}
            onChange={(e) => onChange("mobileLineNumber", e.target.value)}
            ref={withMask("(99) 9 9999-9999", {
              placeholder: "(00) 0 0000-0000",
              showMaskOnHover: false,
              showMaskOnFocus: false,
            })}
          />
          {errors.mobileLineNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.mobileLineNumber}</p>
          )}
        </div>
      )}

      <div className="lg:col-span-2">
        <p className="font-light">Chip virtual</p>
        <p className="text-xs opacity-75 font-light mb-4">
          O <span className="font-bold">eSIM</span> substitui o chip físico e é prático e seguro. Vamos enviar as instruções de ativação por e-mail, é só seguir as etapas
        </p>
        <div className="flex items-center gap-2 p-4 border rounded-sm">
          <Switch checked={form.eSim} onCheckedChange={(checked) => onChange("eSim", checked)} />
          <Label className="text-sm font-normal">eSim</Label>
        </div>
      </div>
    </div>
  )
}
