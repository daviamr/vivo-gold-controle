import { Customer } from "@/interface/Customer"
import { IPlan } from "@/interface/Plan"
import { fetchProducts } from "@/lib/api/products"
import {
  closeOrder,
  createOrder,
  updateOrder,
  type CreateOrderPayload,
  type OrderAddressComplement,
  type UpdateOrderPayload,
} from "@/lib/api/orders"
import { verifyEmail, verifyPhone, type EmailVerificationResult } from "@/lib/api/verification"
import {
  VIVO_CATEGORY,
  VIVO_COMPANY_ID,
  VIVO_COMPANY_NAME,
  VIVO_JOURNEY,
  VIVO_LANDING_PAGE,
  getVivoClientType,
} from "@/lib/constants/vivo"
import {
  getOrderSession,
  getPartnerSessionFields,
  saveOrderSession,
} from "@/lib/order-storage"
import { getResolvedPartnerHash } from "@/lib/partner-hash"

type PlanExtra = {
  id: string
  price: number
  title: string
  default_checked: boolean
  checked?: boolean
}

export class VivoFibraAPI {
  static normalizePlanExtras(extras: unknown): PlanExtra[] {
    if (extras == null) return []
    if (Array.isArray(extras)) return extras as PlanExtra[]
    if (typeof extras === "object") return [extras as PlanExtra]
    return []
  }

  async saveConsultOrder(plan: IPlan, mobileLine?: string): Promise<{ id?: number; order_token?: string }> {
    const session = await this.ensureOrderSession()
    if (!session) return {}

    await updateOrder(
      session.orderId,
      session.orderToken,
      this.buildPlanPayload(plan, mobileLine),
    )

    return { id: session.orderId, order_token: session.orderToken }
  }

  async updateOrderProgress(orderId: number, partial: UpdateOrderPayload): Promise<unknown> {
    const token = getOrderSession()?.orderToken
    if (!token) {
      throw new Error("Sessão do pedido não encontrada.")
    }

    return updateOrder(orderId, token, partial)
  }

  async closeCurrentOrder() {
    const session = getOrderSession()
    if (!session) return null
    return closeOrder(session.orderId, session.orderToken)
  }

  static extractOrderId(data: unknown): number | undefined {
    if (!data || typeof data !== "object") return undefined
    const o = data as Record<string, unknown>
    const nested = o.order && typeof o.order === "object" ? (o.order as Record<string, unknown>).id : undefined
    const id = nested ?? o.id ?? o.order_id
    return typeof id === "number" ? id : undefined
  }

  static extractOrderNumber(data: unknown): string | undefined {
    if (!data || typeof data !== "object") return undefined
    const o = data as Record<string, unknown>
    const nested = o.order && typeof o.order === "object"
      ? (o.order as Record<string, unknown>).ordernumber ?? (o.order as Record<string, unknown>).order_number
      : undefined
    const num = nested ?? o.ordernumber ?? o.order_number ?? o.numero_pedido
    return typeof num === "string" ? num : undefined
  }

  static generateClientOrderNumber(): string {
    const d = new Date()
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(d)
      .reduce<Record<string, string>>((acc, p) => {
        if (p.type !== "literal") acc[p.type] = p.value
        return acc
      }, {})
    const ymd = `${parts.year ?? ""}${parts.month ?? ""}${parts.day ?? ""}`
    const n = Math.floor(Math.random() * 90000) + 10000
    return `${ymd}${n}`
  }

  buildPlanPayload(plan: IPlan, mobileLine?: string): UpdateOrderPayload {
    const session = getOrderSession()
    const extrasList = VivoFibraAPI.normalizePlanExtras(plan.extras)
    const selected = extrasList.filter((extra) => extra.checked === true || extra.default_checked === true)
    const extrasPrice = selected.reduce((sum, extra) => sum + (Number(extra.price) || 0), 0)
    const baseMonthly = plan.pricing.base_monthly

    return {
      partner_id: session?.partnerId ?? null,
      business_partner: session?.partnerName ?? VIVO_COMPANY_NAME,
      category: VIVO_CATEGORY,
      landing_page: VIVO_LANDING_PAGE,
      plan: {
        id: String(plan.id),
        name: plan.name,
        speed: plan.offer_title,
        value: baseMonthly,
        original_value: null,
      },
      selected_extras: selected.map((extra) => ({
        id: extra.id,
        label: extra.title,
        description: extra.title,
        price: extra.price,
        bonus: null,
      })),
      price_summary: {
        plan_price: baseMonthly,
        extras_price: extrasPrice,
        total_monthly: baseMonthly + extrasPrice,
      },
      ...(mobileLine ? { line_action: mobileLine } : {}),
    }
  }

  buildStep1Payload(args: {
    fullName: string
    tel: string
    email: string
    mobileLine?: string
    mobileLineNumber?: string
    eSim?: boolean
    ddi?: string
    emailVerification?: EmailVerificationResult | null
  }): UpdateOrderPayload {
    return {
      full_name: this.formatFullName(args.fullName),
      phone: this.buildPhoneWithCountry(args.ddi, args.tel),
      email: args.email.toLowerCase(),
      is_email_valid: args.emailVerification?.isValid ?? false,
      email_validation_reason: args.emailVerification?.reason ?? "NOT_CHECKED",
      line_action: args.mobileLine ?? "",
      ...(args.mobileLineNumber
        ? { line_number_informed: this.onlyNumber(args.mobileLineNumber) }
        : {}),
      wants_esim: Boolean(args.eSim),
    }
  }

  buildStep2Payload(addr: Customer["address"]): UpdateOrderPayload {
    const complement = this.buildAddressComplement(addr)

    return {
      zip_code: this.onlyNumber(addr.cep ?? ""),
      address: addr.street ?? addr.logradouro ?? "",
      address_number: addr.homeNumber,
      district: addr.district ?? addr.bairro ?? "",
      city: addr.city ?? addr.localidade ?? "",
      state: addr.uf ?? "",
      address_complement: complement,
      address_reference_point: complement.reference_point,
    }
  }

  buildStep3Payload(dueDay: string): UpdateOrderPayload {
    return { due_day: dueDay }
  }

  buildStep4Payload(args: {
    cpf: string
    bornDate: string
    primaryTel: string
    secondaryTel?: string
    ddi?: string
    ddiAdditional?: string
    termsOfUse?: boolean
    acceptOffers?: boolean
    orderNumber?: string
  }): UpdateOrderPayload {
    return {
      cpf: this.onlyNumber(args.cpf),
      birth_date: args.bornDate,
      phone: this.buildPhoneWithCountry(args.ddi, args.primaryTel),
      additional_phone: args.secondaryTel?.trim()
        ? this.buildPhoneWithCountry(args.ddiAdditional, args.secondaryTel)
        : null,
      terms_accepted: Boolean(args.termsOfUse),
      accept_offers: Boolean(args.acceptOffers),
      order_number: args.orderNumber,
      is_consultation: false,
      is_order: true,
    }
  }

  buildPhoneWithCountry(ddi: string | undefined, nationalNumber: string): string {
    const digits = this.onlyNumber(nationalNumber)
    const ddiDigits = this.onlyNumber(ddi ?? "55")
    if (digits.startsWith(ddiDigits)) return digits
    return `${ddiDigits}${digits}`
  }

  additionalsMonthlyTotal(plan: IPlan): number {
    return VivoFibraAPI.normalizePlanExtras(plan.extras)
      .filter((extra) => extra.checked === true)
      .reduce((sum, extra) => sum + (Number(extra.price) || 0), 0)
  }

  async verifyTel(ddi: string, tel: string) {
    if (!this.onlyNumber(ddi).startsWith("55")) return true
    const valid = await verifyPhone(tel)
    return valid !== false
  }

  async verifyEmail(email: string) {
    const result = await verifyEmail(email)
    return result?.isValid ? "VALIDO" : "INVALIDO"
  }

  async getPlans() {
    try {
      return await fetchProducts()
    } catch (error) {
      console.log(error)
      return []
    }
  }

  private async ensureOrderSession() {
    const existing = getOrderSession()
    if (existing) return existing

    const customer = this.readCustomer()
    const cep = customer?.address?.cep ?? ""
    const stored = getPartnerSessionFields()
    const partnerHash = stored.partnerHash ?? getResolvedPartnerHash()

    const [clientIp, fingerprint] = await Promise.all([
      this.fetchClientIp(),
      this.getFingerprintForPayload(),
    ])

    const payload: CreateOrderPayload = {
      status: "ABERTO",
      company: VIVO_COMPANY_NAME,
      company_id: VIVO_COMPANY_ID,
      business_partner: stored.partnerName ?? VIVO_COMPANY_NAME,
      partner_id: stored.partnerId ?? null,
      category: VIVO_CATEGORY,
      client_type: getVivoClientType(),
      landing_page: VIVO_LANDING_PAGE,
      zip_code: this.onlyNumber(cep),
      address: customer?.address?.street ?? customer?.address?.logradouro ?? "",
      address_number: customer?.address?.homeNumber ?? "",
      district: customer?.address?.district ?? customer?.address?.bairro ?? "",
      city: customer?.address?.city ?? customer?.address?.localidade ?? "",
      state: customer?.address?.uf ?? "",
      address_complement: this.buildAddressComplement(customer?.address),
      client_ip: clientIp,
      fingerprint,
      url: this.buildMarketingUrl(),
      lp_url: this.buildLpUrl(partnerHash ?? undefined),
      terms_accepted: false,
      accept_offers: false,
      is_consultation: true,
      is_order: false,
      journey: [...VIVO_JOURNEY],
      previous_order_id: null,
    }

    const response = await createOrder(payload)
    if (!response?.order?.id || !response.order_token) {
      return null
    }

    const session = {
      orderId: response.order.id,
      orderToken: response.order_token,
      expiresAt: response.expires_at,
      partnerId: stored.partnerId,
      partnerName: stored.partnerName,
      partnerLogoUrl: stored.partnerLogoUrl,
      partnerHash,
      partnerCnpj: stored.partnerCnpj,
    }
    saveOrderSession(session)
    return session
  }

  private buildAddressComplement(addr?: Customer["address"]): OrderAddressComplement {
    const building =
      addr?.liveIn === "house" ? "house" : addr?.liveIn === "building" ? "building" : addr?.liveIn ?? "house"

    return {
      building_or_house: building,
      unit_type: null,
      unit_number: null,
      floor: addr?.floor?.trim() || null,
      block: addr?.block?.trim() || null,
      lot: addr?.lot?.trim() || null,
      square: addr?.block?.trim() || null,
      home_complement: addr?.complement ?? addr?.complemento ?? null,
      reference_point: addr?.landmark?.trim() || null,
    }
  }

  private readCustomer(): Customer | null {
    if (typeof window === "undefined") return null
    try {
      const raw = localStorage.getItem("customer")
      return raw ? JSON.parse(raw) as Customer : null
    } catch {
      return null
    }
  }

  private buildMarketingUrl() {
    if (typeof window === "undefined") return ""
    const { origin, search } = window.location
    return search ? `${origin}/${search}` : `${origin}/`
  }

  private buildLpUrl(partnerHash?: string) {
    if (typeof window === "undefined") return ""
    if (partnerHash) return `${window.location.origin}/${partnerHash}`
    return window.location.href
  }

  private static isLoopbackOrLocalIp(ip: string): boolean {
    const t = ip.trim().toLowerCase()
    if (!t) return true
    if (t === "::1" || t === "127.0.0.1") return true
    if (t === "::ffff:127.0.0.1" || t === "0:0:0:0:0:0:0:1") return true
    return false
  }

  private async fetchClientIp(): Promise<string> {
    if (typeof window === "undefined") return ""
    try {
      const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" })
      if (!res.ok) return ""
      const data = (await res.json()) as { ip?: string }
      const ip = typeof data.ip === "string" ? data.ip.trim() : ""
      if (ip && !VivoFibraAPI.isLoopbackOrLocalIp(ip)) return ip
    } catch {
    }
    return ""
  }

  private async getFingerprintForPayload() {
    const { finger_print } = this.getFingerprint()
    return {
      ...finger_print,
      language: typeof navigator !== "undefined" ? navigator.language : "pt-BR",
    }
  }

  getFingerprint() {
    const ua = navigator.userAgent

    const getOS = () => {
      if (/android/i.test(ua)) {
        const m = ua.match(/Android\s([0-9.]+)/)?.[1]
        return { name: "Android", version: m ? `${m}.0` : "0.0.0" }
      }
      if (/iphone|ipad/i.test(ua)) {
        const m = ua.match(/OS\s([0-9_]+)/)?.[1]
        return { name: "iOS", version: m ? m.replace(/_/g, ".") : "0.0.0" }
      }
      if (/windows/i.test(ua)) return { name: "Windows", version: "10.0.0" }
      if (/mac/i.test(ua)) return { name: "MacOS", version: "10.0.0" }
      if (/linux/i.test(ua)) return { name: "Linux", version: "0.0.0" }
      return { name: "Unknown", version: "0.0.0" }
    }

    const getDevice = () => {
      if (/mobile/i.test(ua)) return "mobile"
      if (/tablet/i.test(ua)) return "tablet"
      return "desktop"
    }

    const getBrowser = () => {
      const browsers = [
        { name: "Chrome", regex: /Chrome\/([0-9.]+)/ },
        { name: "Firefox", regex: /Firefox\/([0-9.]+)/ },
        { name: "Safari", regex: /Version\/([0-9.]+).*Safari/ },
        { name: "Edge", regex: /Edg\/([0-9.]+)/ },
      ]
      for (const b of browsers) {
        const match = ua.match(b.regex)
        if (match) return { name: b.name, version: match[1] }
      }
      const fallback = ua.match(/([A-Za-z]+)\/([0-9.]+)/)
      return fallback
        ? { name: fallback[1], version: fallback[2] }
        : { name: "Unknown", version: "0.0.0" }
    }

    const timezoneOffset = new Date().getTimezoneOffset()

    return {
      finger_print: {
        os: getOS(),
        device: getDevice(),
        browser: getBrowser(),
        timezone: `GMT${timezoneOffset > 0 ? "-" : "+"}${Math.abs(timezoneOffset / 60)}`,
        resolution: {
          dpr: window.devicePixelRatio,
          width: window.screen.width,
          height: window.screen.height,
        },
        timezone_offset: timezoneOffset,
      },
    }
  }

  formatFullName(value: string): string {
    const s = value.trim().toLowerCase()
    if (!s) return ""
    return s
      .split(/\s+/)
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
      .filter(Boolean)
      .join(" ")
  }

  onlyNumber(value: string): string {
    return value.replace(/\D/g, "")
  }
}
