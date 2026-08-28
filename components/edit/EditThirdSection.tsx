"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { EditFormData } from "./edit-form"

const DUE_DAYS = ["01", "10", "17", "21", "26"]

type Props = {
  form: EditFormData
  onChange: (field: keyof EditFormData, value: string | boolean) => void
  errors?: Partial<Record<keyof EditFormData, string>>
}

export default function EditThirdSection({ form, onChange, errors = {} }: Props) {
  return (
    <div className="grid gap-4 my-4">
      <p className="font-light mb-1">Dia de vencimento</p>
      <p className="text-2xl font-semibold text-gray-800">
        Qual é o dia de vencimento que melhor se adequa a sua necessidade?
      </p>
      <RadioGroup
        className="flex items-center justify-center my-2 border rounded-sm"
        value={form.dueDay}
        onValueChange={(value) => onChange("dueDay", value)}>
        {DUE_DAYS.map((date) => (
          <div className="flex items-center justify-center border-x gap-2 grow p-2" key={date}>
            <RadioGroupItem value={date} id={`edit-due-${date}`} />
            <Label htmlFor={`edit-due-${date}`} className="text-2xl font-normal">{date}</Label>
          </div>
        ))}
      </RadioGroup>
      {errors.dueDay && <p className="text-red-500 text-sm mt-1">{errors.dueDay}</p>}
      <p className="font-light mt-2 text-sm">*Sua fatura é digital e será enviada por e-mail.</p>
    </div>
  )
}
