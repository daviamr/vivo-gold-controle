export const DDI_OPTIONS = [
  { label: "🇧🇷 +55", value: "+55", mask: "(99) 9 9999-9999", digits: "55" },
  { label: "🇺🇸 +1", value: "+1", mask: "(999) 999-9999", digits: "1" },
  { label: "🇬🇧 +44", value: "+44", mask: "99 9999 9999", digits: "44" },
  { label: "🇵🇹 +351", value: "+351", mask: "999 999 999", digits: "351" },
] as const

export type DdiOption = (typeof DDI_OPTIONS)[number]

export function ddiMask(ddi: string | undefined): string {
  return DDI_OPTIONS.find((d) => d.value === ddi)?.mask ?? "(99) 9 9999-9999"
}
