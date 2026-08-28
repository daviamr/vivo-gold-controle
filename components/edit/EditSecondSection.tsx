"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ViaCEP } from "@/lib/ViaCEP"
import { cleanNumbers } from "@/lib/helpers/formatters"
import type { EditFormData } from "./edit-form"
import { withMask } from "use-mask-input"

const viaCep = new ViaCEP()

function formatCepDisplay(digits: string): string {
  const d = cleanNumbers(digits)
  if (d.length !== 8) return digits
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

type Props = {
  form: EditFormData
  onChange: (field: keyof EditFormData, value: string | boolean) => void
  errors?: Partial<Record<keyof EditFormData, string>>
}

export default function EditSecondSection({ form, onChange, errors = {} }: Props) {
  const [cepLoading, setCepLoading] = useState(false)
  const lastFetchedCepRef = useRef<string | null>(null)

  useEffect(() => {
    const clean = cleanNumbers(form.cep || "")
    if (clean.length !== 8) {
      lastFetchedCepRef.current = null
      return
    }
    if (lastFetchedCepRef.current === clean) return

    let cancelled = false

    const run = async () => {
      setCepLoading(true)
      try {
        const response = await viaCep.searchCEP(clean)
        if (cancelled) return
        if (!response || response.erro) return

        lastFetchedCepRef.current = clean
        onChange("cep", formatCepDisplay(response.cep || clean))
        onChange("street", response.logradouro ?? "")
        onChange("district", response.bairro ?? "")
        onChange("city", response.localidade ?? "")
        onChange("uf", (response.uf ?? "").toUpperCase())
      } finally {
        if (!cancelled) setCepLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [form.cep, onChange])

  return (
    <div className="grid gap-4 my-4 lg:grid-cols-2">
      <div>
        <Label className="text-1xl font-normal mb-1">CEP</Label>
        <div className="relative">
          <Input
            type="text"
            placeholder="CEP"
            className={cepLoading ? "pr-10" : undefined}
            value={form.cep}
            maxLength={9}
            disabled={cepLoading}
            onChange={(e) => onChange("cep", e.target.value)}
            ref={withMask("99999-999", {
              placeholder: "_",
              showMaskOnHover: false,
              showMaskOnFocus: false,
            })}
          />
          {cepLoading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          )}
        </div>
        {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
      </div>

      <div>
        <Label htmlFor="edit-homeNumber" className="text-1xl font-normal mb-1">Número</Label>
        <Input
          type="text"
          id="edit-homeNumber"
          value={form.homeNumber}
          onChange={(e) => onChange("homeNumber", e.target.value)}
        />
        {errors.homeNumber && <p className="text-red-500 text-sm mt-1">{errors.homeNumber}</p>}
      </div>

      <span className="flex items-center gap-2 text-sm lg:col-span-2">
        <Checkbox
          id="edit-hasBlockAndLot"
          checked={form.hasBlockAndLot}
          onCheckedChange={(checked) => {
            const value = checked === "indeterminate" ? false : checked
            onChange("hasBlockAndLot", value)
            if (!value) {
              onChange("block", "")
              onChange("lot", "")
            }
          }}
        />
        Quero informar quadra e lote
      </span>

      {form.hasBlockAndLot && (
        <>
          <div>
            <Label htmlFor="edit-block" className="text-1xl font-normal mb-1">Quadra</Label>
            <Input
              type="text"
              id="edit-block"
              value={form.block}
              onChange={(e) => onChange("block", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-lot" className="text-1xl font-normal mb-1">Lote</Label>
            <Input
              type="text"
              id="edit-lot"
              value={form.lot}
              onChange={(e) => onChange("lot", e.target.value)}
            />
          </div>
        </>
      )}

      <div className="lg:col-span-2">
        <Label htmlFor="edit-street" className="text-1xl font-normal mb-1">Endereço</Label>
        <Input
          type="text"
          id="edit-street"
          value={form.street}
          onChange={(e) => onChange("street", e.target.value)}
        />
        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
      </div>

      <div className="grid gap-4 lg:col-span-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="edit-district" className="text-1xl font-normal mb-1">Bairro</Label>
          <Input
            type="text"
            id="edit-district"
            value={form.district}
            onChange={(e) => onChange("district", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="edit-city" className="text-1xl font-normal mb-1">Cidade</Label>
          <Input
            type="text"
            id="edit-city"
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="edit-uf" className="text-1xl font-normal mb-1">Estado</Label>
          <Input
            type="text"
            id="edit-uf"
            maxLength={2}
            className="uppercase"
            value={form.uf}
            onChange={(e) => onChange("uf", e.target.value.toUpperCase().slice(0, 2))}
          />
        </div>
      </div>

      <div className="lg:col-span-2">
        <p className="text-2xl">Você mora em:</p>
        <RadioGroup
          className="flex items-center gap-4 px-4 my-2 lg:px-0"
          value={form.liveIn}
          onValueChange={(value) => onChange("liveIn", value)}>
          <div className="flex items-center gap-2 lg:ml-4">
            <RadioGroupItem value="building" id="edit-building" />
            <Label htmlFor="edit-building" className="font-light text-1xl">Edifício</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="house" id="edit-house" />
            <Label htmlFor="edit-house" className="font-light text-1xl">Casa</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-1xl font-normal mb-1">Complemento completo</Label>
        <Input
          type="text"
          placeholder="Ex: Bloco B"
          value={form.complement}
          onChange={(e) => onChange("complement", e.target.value)}
        />
        <span className="opacity-75 text-sm font-light">{form.liveIn === "house" ? "Opcional" : "Obrigatório"}</span>
      </div>

      <div>
        <Label className="text-1xl font-normal mb-1">
          {form.liveIn === "house" ? "Ponto de Referência" : "Andar"}
        </Label>
        <Input
          type="text"
          placeholder={form.liveIn === "house" ? "Ex: Próximo ao Mercado" : "Ex: 301"}
          value={form.liveIn === "house" ? form.landmark : form.floor}
          onChange={(e) => onChange(form.liveIn === "house" ? "landmark" : "floor", e.target.value)}
        />
        <span className="opacity-75 text-sm font-light">{form.liveIn === "house" ? "Opcional" : "Obrigatório"}</span>
      </div>
    </div>
  )
}
