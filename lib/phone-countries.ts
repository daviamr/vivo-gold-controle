export type PhoneCountry = {
  code: string
  name: string
  dialCode: string
  flag: string
  maxLocalDigits: number
  validateLocalNumber: (localNumber: string) => boolean
}

export const phoneCountries: PhoneCountry[] = [
  {
    code: "BR",
    name: "Brasil",
    dialCode: "55",
    flag: "🇧🇷",
    maxLocalDigits: 11,
    validateLocalNumber: (localNumber) => /^\d{10,11}$/.test(localNumber),
  },
  {
    code: "US",
    name: "Estados Unidos",
    dialCode: "1",
    flag: "🇺🇸",
    maxLocalDigits: 10,
    validateLocalNumber: (localNumber) => /^\d{10}$/.test(localNumber),
  },
  {
    code: "GB",
    name: "Reino Unido",
    dialCode: "44",
    flag: "🇬🇧",
    maxLocalDigits: 10,
    validateLocalNumber: (localNumber) => /^\d{10}$/.test(localNumber),
  },
  {
    code: "PT",
    name: "Portugal",
    dialCode: "351",
    flag: "🇵🇹",
    maxLocalDigits: 9,
    validateLocalNumber: (localNumber) => /^\d{9}$/.test(localNumber),
  },
]

export const DEFAULT_PHONE_COUNTRY = phoneCountries[0]

export function getPhoneCountryByCode(code: string): PhoneCountry | undefined {
  return phoneCountries.find((country) => country.code === code)
}
