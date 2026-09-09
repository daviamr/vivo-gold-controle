import { verificationApi } from "@/lib/api"

type VerifyEmailResponse = {
  is_email_valid?: number
  email_status?: string
}

type VerifyPhoneResponse = {
  numero_valido?: boolean
}

export type EmailVerificationResult = {
  isValid: boolean
  reason: string
}

export function getPhoneDigitsForVerification(phone: string) {
  const digits = phone.replace(/\D/g, "")

  if (digits.startsWith("55") && digits.length > 11) {
    return digits.slice(2, 13)
  }

  return digits.slice(0, 11)
}

export async function verifyEmail(email: string): Promise<EmailVerificationResult | null> {
  try {
    const { data } = await verificationApi.post<VerifyEmailResponse>("/verificar-email", {
      email,
    })

    const isValid = data.is_email_valid === 1 || data.email_status === "VALIDO"
    return { isValid, reason: isValid ? "VALID" : "INVALID" }
  } catch {
    return null
  }
}

export async function verifyPhone(phone: string): Promise<boolean | null> {
  try {
    const telefone = getPhoneDigitsForVerification(phone)
    const { data } = await verificationApi.post<VerifyPhoneResponse>("/verificar-telefone", {
      telefone,
    })

    return data.numero_valido === true
  } catch {
    return null
  }
}
