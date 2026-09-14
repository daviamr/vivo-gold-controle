"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { phoneCountries, type PhoneCountry } from "@/lib/phone-countries"
import { buildFullPhoneNumber, formatBrazilLocalNumber, parsePhoneNumber } from "@/lib/phone"
import { cn } from "@/lib/utils"

type PhoneInputProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  "aria-invalid"?: boolean
  className?: string
}

export function PhoneInput({
  id,
  value,
  onChange,
  required,
  "aria-invalid": ariaInvalid,
  className,
}: PhoneInputProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<PhoneCountry>(
    () => parsePhoneNumber(value).country,
  )
  const [localNumber, setLocalNumber] = useState(
    () => parsePhoneNumber(value).localNumber,
  )

  useEffect(() => {
    const parsed = parsePhoneNumber(value)
    setSelectedCountry(parsed.country)
    setLocalNumber(parsed.localNumber)
  }, [value])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleCountrySelect = (country: PhoneCountry) => {
    setSelectedCountry(country)
    setIsOpen(false)
    onChange(buildFullPhoneNumber(country, localNumber))
  }

  const handleLocalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, selectedCountry.maxLocalDigits)
    setLocalNumber(digits)
    onChange(buildFullPhoneNumber(selectedCountry, digits))
  }

  const displayValue =
    selectedCountry.code === "BR"
      ? formatBrazilLocalNumber(localNumber)
      : localNumber

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full min-w-0 rounded-sm border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        ariaInvalid && "border-destructive ring-3 ring-destructive/20",
        className,
      )}
      aria-invalid={ariaInvalid}>
      <div className="shrink-0 border-r border-input rounded-l-sm overflow-hidden">
        <button
          type="button"
          aria-label={`País selecionado: ${selectedCountry.name}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="flex h-full items-center gap-1 px-3 text-base cursor-pointer hover:bg-muted/40 md:text-sm"
          onClick={() => setIsOpen((current) => !current)}>
          <span className="text-xl leading-none" aria-hidden="true">
            {selectedCountry.flag}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Selecionar país"
          className="absolute left-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-md border border-input bg-background shadow-md">
          {phoneCountries.map((country) => (
            <li key={country.code} role="option" aria-selected={country.code === selectedCountry.code}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted/60 cursor-pointer"
                onClick={() => handleCountrySelect(country)}>
                <span className="text-lg leading-none" aria-hidden="true">
                  {country.flag}
                </span>
                <span>{country.name}</span>
                <span className="ml-auto text-muted-foreground">
                  +{country.dialCode}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <span className="flex shrink-0 items-center px-2 text-base text-muted-foreground md:text-sm">
        +{selectedCountry.dialCode}
      </span>

      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={displayValue}
        onChange={handleLocalNumberChange}
        required={required}
        aria-invalid={ariaInvalid}
        className="h-full w-full min-w-0 bg-transparent pr-3 py-[12.5px] text-base outline-none placeholder:text-muted-foreground md:text-sm"
      />
    </div>
  )
}
