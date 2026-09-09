"use client"

import { withMask } from "use-mask-input"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DDI_OPTIONS, ddiMask } from "@/lib/constants/phone"

type Props = {
  id: string
  ddi: string
  value: string
  onDdiChange: (ddi: string) => void
  onValueChange: (value: string) => void
  error?: string
}

export default function PhoneField({ id, ddi, value, onDdiChange, onValueChange, error }: Props) {
  const mask = ddiMask(ddi)

  return (
    <div>
      <div className="flex flex-wrap gap-2 min-w-0">
        <Select
          key={ddi}
          value={ddi}
          onValueChange={(next) => {
            onDdiChange(next)
            onValueChange("")
          }}>
          <SelectTrigger className="w-[110px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DDI_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          ref={withMask(mask, {
            placeholder: "",
            showMaskOnHover: false,
            showMaskOnFocus: false,
          })}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
