import { Customer } from "@/interface/Customer";
import { IPlan } from "@/interface/Plan";
import { api } from "./api"

const TELEFONIA_ORDER_PATH = "pedido-telefonia-movel"

type PlanExtra = {
  id: string
  price: number
  title: string
  default_checked: boolean
  checked?: boolean
}

type ConsultOrderFingerprintMeta = {
  visitor_id: string
  finger_print: {
    os: { name: string; version: string }
    device: string
    browser: { name: string; version: string }
    timezone: string
    resolution: { dpr: number; width: number; height: number }
    timezone_offset: number
  }
}

export class VivoFibraAPI {

  static normalizePlanExtras(extras: unknown): PlanExtra[] {
    if (extras == null) return []
    if (Array.isArray(extras)) return extras as PlanExtra[]
    if (typeof extras === "object") return [extras as PlanExtra]
    return []
  }

  async saveConsultOrder(plan: IPlan, mobileLine?: string): Promise<any> {
    const [clientIp, fingerprint] = await Promise.all([
      this.fetchClientIp(),
      this.getFingerprintForPayload(),
    ])
    const payload = this.buildConsultOrderPayload(plan, mobileLine, {
      clientIp,
      fingerprint,
    })
    // console.log('>>> payload', payload)
    const response = await api.post(TELEFONIA_ORDER_PATH,
      payload, { headers: { 'Content-Type': 'application/json' } })
    return response.data
  }

  async updateOrderProgress(orderId: number, partial: Record<string, unknown>): Promise<any> {
    // console.log('>>> partial', partial)
    const response = await api.put(
      `${TELEFONIA_ORDER_PATH}/${orderId}`,
      partial,
      { headers: { 'Content-Type': 'application/json' } }
    )
    return response.data
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
      ? (o.order as Record<string, unknown>).ordernumber
      : undefined
    const num = nested ?? o.ordernumber ?? o.numero_pedido
    return typeof num === "string" ? num : undefined
  }

  /** YYYYMMDD em America/Sao_Paulo (UTC-3) + hífen + 5 dígitos aleatórios (10000–99999). */
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
    const y = parts.year ?? ""
    const m = parts.month ?? ""
    const day = parts.day ?? ""
    const ymd = `${y}${m}${day}`
    const n = Math.floor(Math.random() * 90000) + 10000
    return `${ymd}${n}`
  }

  buildConsultOrderPayload(
    plan: IPlan,
    mobileLine?: string,
    meta?: { clientIp?: string; fingerprint?: ConsultOrderFingerprintMeta | null },
  ) {
    const now = this.brDateTime()
    const baseMonthly = plan.pricing.base_monthly
    const installationFee = plan.pricing.installation ?? 0
    const additionalsMonthly = this.additionalsMonthlyTotal(plan)
    const extrasList = VivoFibraAPI.normalizePlanExtras(plan.extras)
    const lineAction = mobileLine ?? ""
    return {
      pedido: {
        status: "aberto",
        typeclient: "PF",
        landing_page: "vivo_controle",
        client_ip: meta?.clientIp ?? "",
        finger_print: meta?.fingerprint?.finger_print ?? {
          os: { name: "Unknown", version: "0.0.0" },
          device: "desktop",
          browser: { name: "Unknown", version: "0.0.0" },
          timezone: "GMT+0",
          resolution: { dpr: 1, width: 0, height: 0 },
          timezone_offset: 0,
        },
        consulta: 1,
        pedido: 0,
        url: typeof window !== "undefined" ? window.location.href : "",
        line_action: lineAction,
        created_at: now,
        updated_at: now,
        plan: {
          id: plan.id,
          category: plan.category,
          plan_name: plan.name,
          base_price: baseMonthly,
          landing_page: "vivo_controle",
          selected_additionals: extrasList
            .filter((e) => e.checked === true)
            .map((e) => ({ id: e.id, title: e.title, price: e.price })),
        },
        price_summary: {
          total: baseMonthly + additionalsMonthly,
          currency: "BRL",
          base_monthly: baseMonthly,
          installation_fee: installationFee,
          additionals_monthly: additionalsMonthly,
        }
      },
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
  }) {
    return {
      pedido: {
        fullname: this.formatFullName(args.fullName),
        phone: this.buildPhoneWithCountry(args.ddi, args.tel),
        email: args.email.toLowerCase(),
        pedido: 1,
        line_action: args.mobileLine ?? "",
        ...(args.mobileLineNumber
          ? { line_number_informed: this.onlyNumber(args.mobileLineNumber) }
          : {}),
        wants_esim: args.eSim ? 1 : 0,
        typeclient: 'PF'
      }
    }
  }

  buildStep2Payload(addr: Customer["address"]) {
    const building =
      addr.liveIn === "house" ? "house" : addr.liveIn === "building" ? "building" : addr.liveIn ?? ""
    const body: { pedido: Record<string, unknown> } = {
      pedido: {
        cep: addr.cep,
        address: addr.street ?? addr.logradouro ?? "",
        addressnumber: addr.homeNumber,
        district: addr.district ?? addr.bairro ?? "",
        city: addr.city ?? addr.localidade ?? "",
        state: addr.uf ?? "",
        buildingorhouse: building,
      }
    }
    if (addr.block) body.pedido.addressblock = addr.block
    if (addr.lot) body.pedido.addresslot = addr.lot
    const complement = addr.complement ?? addr.complemento
    if (complement) body.pedido.addresscomplement = complement
    if (addr.landmark) body.pedido.addressreferencepoint = addr.landmark
    if (addr.floor) body.pedido.addressFloor = addr.floor
    return body
  }

  buildStep3Payload(dueDay: string) {
    const n = parseInt(dueDay, 10)
    return { pedido: { dueday: Number.isFinite(n) ? n : dueDay } }
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
  }) {
    const body: { pedido: Record<string, unknown> } = {
      pedido: {
        cpf: this.onlyNumber(args.cpf),
        birthdate: args.bornDate,
        phone: this.buildPhoneWithCountry(args.ddi, args.primaryTel),
        terms_accepted: args.termsOfUse ? 1 : 0,
        accept_offers: args.acceptOffers ? 1 : 0,
        status: "fechado",
      }
    }
    if (args.secondaryTel?.trim()) {
      body.pedido.phoneAdditional = this.buildPhoneWithCountry(
        args.ddiAdditional,
        args.secondaryTel,
      )
    }
    if (args.orderNumber) {
      body.pedido.ordernumber = args.orderNumber
    }
    return body
  }

  buildPhoneWithCountry(ddi: string | undefined, nationalNumber: string): string {
    const digits = this.onlyNumber(nationalNumber)
    const ddiDigits = this.onlyNumber(ddi ?? "55")
    if (digits.startsWith(ddiDigits)) return digits
    return `${ddiDigits}${digits}`
  }

  additionalsMonthlyTotal(plan: IPlan): number {
    return VivoFibraAPI.normalizePlanExtras(plan.extras)
      .filter((e) => e.checked === true)
      .reduce((sum, e) => sum + (Number(e.price) || 0), 0)
  }

  brDateTime(): string {
    return new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  async verifyTel(ddi: string, tel: string) {
    if (!this.onlyNumber(ddi).startsWith('55')) return true;

    const payload = {
      telefone: this.onlyNumber(tel)
    }
    const response = await api.post('verificar-telefone',
      payload, { headers: { 'Content-Type': 'application/json' } })

    console.log('>>> response verifyTel', response.data)
    return response.data.numero_valido
  }

  async verifyEmail(email: string) {
    const payload = {
      email: email
    }
    const response = await api.post('verificar-email',
      payload, { headers: { 'Content-Type': 'application/json' } })

    console.log('>>> response verifyEmail', response.data)
    return response.data.email_status
  }

  async getPlans() {
    try {
      const response = await api.get('/planos/telefonia-movel?landing_page=vivo_controle')
      const availablePlans = response.data.filter((plan: IPlan) => plan.online)
      return availablePlans
    } catch (error) {
      console.log(error)
    }
  }

  private static isLoopbackOrLocalIp(ip: string): boolean {
    const t = ip.trim().toLowerCase()
    if (!t) return true
    if (t === "::1" || t === "127.0.0.1") return true
    if (t === "::ffff:127.0.0.1" || t === "0:0:0:0:0:0:0:1") return true
    return false
  }

  private async fetchPublicIpFromClient(): Promise<string> {
    try {
      const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" })
      if (!res.ok) return ""
      const data = (await res.json()) as { ip?: string }
      return typeof data.ip === "string" ? data.ip.trim() : ""
    } catch {
      return ""
    }
  }

  private async fetchClientIp(): Promise<string> {
    if (typeof window === "undefined") return ""
    try {
      const res = await fetch("/api/client-ip", { cache: "no-store" })
      if (res.ok) {
        const data = (await res.json()) as { ip?: string }
        const fromHeaders = typeof data.ip === "string" ? data.ip.trim() : ""
        if (fromHeaders && !VivoFibraAPI.isLoopbackOrLocalIp(fromHeaders)) {
          return fromHeaders
        }
      }
    } catch {
    }
    return this.fetchPublicIpFromClient()
  }

  private async getFingerprintForPayload(): Promise<ConsultOrderFingerprintMeta | null> {
    if (typeof window === "undefined") return null
    try {
      const FP = (await import("@fingerprintjs/fingerprintjs")).default
      const fp = await FP.load()
      const { visitorId } = await fp.get()
      const { finger_print } = this.getFingerprint()
      return { visitor_id: visitorId, finger_print }
    } catch {
      try {
        const { finger_print } = this.getFingerprint()
        return { visitor_id: "", finger_print }
      } catch {
        return null
      }
    }
  }

  getFingerprint() {
    const ua = navigator.userAgent;

    // OS
    const getOS = () => {
      if (/android/i.test(ua)) {
        const m = ua.match(/Android\s([0-9.]+)/)?.[1]
        return { name: "Android", version: m ? `${m}.0` : "0.0.0" }
      }
      if (/iphone|ipad/i.test(ua)) {
        const m = ua.match(/OS\s([0-9_]+)/)?.[1]
        return { name: "iOS", version: m ? m.replace(/_/g, ".") : "0.0.0" }
      }
      if (/windows/i.test(ua)) return { name: 'Windows', version: '10.0.0' };
      if (/mac/i.test(ua)) return { name: 'MacOS', version: '10.0.0' };
      if (/linux/i.test(ua)) return { name: 'Linux', version: '0.0.0' };
      return { name: 'Unknown', version: '0.0.0' };
    };

    // Device
    const getDevice = () => {
      if (/mobile/i.test(ua)) return 'mobile';
      if (/tablet/i.test(ua)) return 'tablet';
      return 'desktop';
    };

    // Browser
    const getBrowser = () => {
      const browsers = [
        { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
        { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
        { name: 'Safari', regex: /Version\/([0-9.]+).*Safari/ },
        { name: 'Edge', regex: /Edg\/([0-9.]+)/ },
      ];
      for (const b of browsers) {
        const match = ua.match(b.regex);
        if (match) return { name: b.name, version: match[1] };
      }
      // fallback — pega o que vier no UA (ex: "Not(A:Brand")
      const fallback = ua.match(/([A-Za-z]+)\/([0-9.]+)/);
      return fallback
        ? { name: fallback[1], version: fallback[2] }
        : { name: 'Unknown', version: '0.0.0' };
    };

    const timezoneOffset = new Date().getTimezoneOffset(); // ex: 180 para GMT-3

    // Resolution
    const resolution = {
      dpr: window.devicePixelRatio,
      width: window.screen.width,
      height: window.screen.height,
    };

    return {
      finger_print: {
        os: getOS(),
        device: getDevice(),
        browser: getBrowser(),
        timezone: `GMT${timezoneOffset > 0 ? '-' : '+'}${Math.abs(timezoneOffset / 60)}`,
        resolution,
        timezone_offset: timezoneOffset,
      }
    };
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
    return value.replace(/\D/g, '');
  }
}