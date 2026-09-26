"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input/PhoneInput"
import { Button } from "@/components/ui/button"
import { getOrderSession, ORDER_SESSION_EVENT } from "@/lib/order-storage"
import { updateOrder } from "@/lib/api/orders"
import { VivoFibraAPI } from "@/lib/VivoFibraAPI"
import { isValidPhoneNumber, parsePhoneNumber } from "@/lib/phone"
import { withBasePath } from "@/lib/basePath"

type SupportOption = "whatsapp" | "ligacao"

function toTitleCase(str: string): string {
  return str
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}

type ContactFormProps = {
  option: SupportOption
  orderId: number | null
  orderToken: string | null
  onSuccess: () => void
}

function ContactForm({ option, orderId, orderToken, onSuccess }: ContactFormProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [phoneError, setPhoneError] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isWpp = option === "whatsapp"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isValidPhoneNumber(phone)) {
      setPhoneError(true)
      return
    }
    setPhoneError(false)
    setSubmitError(false)
    setIsLoading(true)

    try {
      const localPhone = parsePhoneNumber(phone).localNumber
      let id = orderId
      let token = orderToken

      if (!id || !token) {
        const session = await new VivoFibraAPI().ensureOrderSession()
        if (!session) {
          setSubmitError(true)
          return
        }
        id = session.orderId
        token = session.orderToken
      }

      await updateOrder(id, token, {
        support: option,
        full_name: toTitleCase(name),
        phone: localPhone,
      })
      onSuccess()
    } catch {
      setSubmitError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <p className="max-w-[300px] text-xs text-center mb-6 mx-auto">
        {isWpp
          ? "Preencha seus dados e receba um contato imediato da nossa equipe diretamente no seu WhatsApp."
          : "Nossos especialistas entram em contato em menos de 5 minutos."}
      </p>

      <div className="mb-4">
        <Label htmlFor="bubble-name" className="text-xs mb-1">Nome Completo</Label>
        <Input
          type="text"
          id="bubble-name"
          className="rounded-sm py-5"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="bubble-phone" className="text-xs mb-1">
          {isWpp ? "WhatsApp" : "Telefone"}
        </Label>
        <PhoneInput
          id="bubble-phone"
          value={phone}
          onChange={(v) => { setPhone(v); setPhoneError(false) }}
          aria-invalid={phoneError}
        />
        {phoneError && (
          <p className="text-xs text-red-600 mt-1">Informe um número de telefone válido.</p>
        )}
      </div>

      {submitError && (
        <p className="text-xs text-red-600 text-center mb-4">Não foi possível enviar. Tente novamente.</p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className={`flex items-center gap-4 w-full rounded-full py-6 cursor-pointer mb-8 disabled:opacity-70 text-white ${
          isWpp ? "bg-[#27D366] hover:bg-[#27D366]/90" : "bg-[#1B38A1] hover:bg-[#1B38A1]/90"
        }`}
      >
        {isLoading
          ? "Enviando..."
          : isWpp
            ? "Receber contato agora"
            : "Me ligue grátis"}
        {!isLoading && (
          <img
            src={withBasePath(isWpp ? "/wpp-icon.png" : "/tel-icon2.png")}
            alt={isWpp ? "Ícone do WhatsApp" : "Ícone de ligação"}
          />
        )}
      </Button>
    </form>
  )
}

type SuccessMessageProps = {
  option: SupportOption
  onTalkToUs: () => void
}

function SuccessMessage({ option, onTalkToUs }: SuccessMessageProps) {
  const isWpp = option === "whatsapp"
  return (
    <>
      <img src={withBasePath("/circle-right.png")} alt="Ícone mensagem de sucesso" className="mt-8" />
      <p className="text-[18px] font-bold my-4 max-w-[232px] text-center">
        {isWpp ? "Confira o seu WhatsApp!" : "Tudo certo! Fique atento ao seu telefone"}
      </p>
      <p className="text-[16px] text-center max-w-[290px]">
        {isWpp
          ? "Recebemos seus dados e já enviamos uma mensagem."
          : "Um consultor ligará para você em instantes."}
      </p>
      <div className="p-4 bg-[#3F3F3F]/10 rounded-sm w-full text-center mt-4 mb-2">
        <p className="text-[14px] font-bold mb-1">
          {isWpp ? "Não recebeu nossa mensagem?" : "Não recebeu nossa ligação?"}
        </p>
        <p className="text-xs max-w-[216px] m-auto mb-2">
          {isWpp
            ? "Envie um chamado manual se não recebeu a mensagem."
            : "Envie sua mensagem e retornaremos o mais breve possível."}
        </p>
        <Button
          type="button"
          onClick={onTalkToUs}
          className="text-xs text-[#3F3F3F] bg-white hover:bg-white/90 rounded-full py-2 cursor-pointer px-8 border border-[#3F3F3F]"
        >
          Falar com o Suporte
        </Button>
      </div>
    </>
  )
}

export default function Bubble({ onTalkToUs }: { onTalkToUs: () => void }) {
  const [orderId, setOrderId] = useState<number | null>(null)
  const [orderToken, setOrderToken] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<SupportOption | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const sync = () => {
      const session = getOrderSession()
      setOrderId(session?.orderId ?? null)
      setOrderToken(session?.orderToken ?? null)
    }

    sync()
    window.addEventListener(ORDER_SESSION_EVENT, sync)
    const interval = setInterval(sync, 1000)

    return () => {
      window.removeEventListener(ORDER_SESSION_EVENT, sync)
      clearInterval(interval)
    }
  }, [])

  if (!isOpen) {
    return (
      <div
        className="fixed z-40 bottom-4 right-4 bg-[#25D366] text-white flex items-center gap-2 rounded-full p-2 sm:px-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <img src={withBasePath("/wpp-icon.png")} alt="Botão whatsapp" />
        <p className="hidden md:block text-[14px] font-bold">Fale com um consultor</p>
      </div>
    )
  }

  function handleClose() {
    setIsOpen(false)
    setSelectedOption(null)
    setShowSuccess(false)
  }

  function handleTalkToUs() {
    handleClose()
    onTalkToUs()
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center text-[#3F3F3F] overflow-y-auto">
      <div className="relative bg-white p-4 px-6 rounded-md w-full max-w-100 mx-2 flex flex-col items-center">
        <div className="absolute top-4 right-4">
          <X size={20} color="#3F3F3F" onClick={handleClose} className="cursor-pointer" />
        </div>

        {showSuccess && selectedOption ? (
          <SuccessMessage option={selectedOption} onTalkToUs={handleTalkToUs} />
        ) : selectedOption ? (
          <>
            <p className="text-[18px] font-bold mt-8 mb-2 max-w-[232px] text-center">
              {selectedOption === "whatsapp"
                ? "Fale com um especialista agora mesmo!"
                : "Em qual número podemos te ligar?"}
            </p>
            <ContactForm
              option={selectedOption}
              orderId={orderId}
              orderToken={orderToken}
              onSuccess={() => setShowSuccess(true)}
            />
          </>
        ) : (
          <>
            <p className="text-[18px] font-bold mt-8 mb-6 text-center">
              O que você gostaria de fazer?
            </p>
            <div className="flex flex-col gap-4 mb-8 w-full">
              <div
                className="flex flex-col justify-around items-center gap-4 p-3 px-6 border border-[#27D366] rounded-sm w-full cursor-pointer sm:flex-row"
                onClick={() => setSelectedOption("whatsapp")}
              >
                <img src={withBasePath("/wpp-icon2.png")} alt="Botão whatsapp" />
                <div className="text-center">
                  <p className="font-bold text-[#27D366] mb-1">Converse no WhatsApp</p>
                  <p className="text-xs max-w-[170px] m-auto">
                    Receba um contato imediato da nossa equipe diretamente no seu WhatsApp.
                  </p>
                </div>
              </div>

              <div
                className="flex flex-col min-h-[152px] justify-around items-center gap-4 p-3 px-6 border border-[#0568A9] rounded-sm w-full cursor-pointer sm:min-h-[102px] sm:flex-row"
                onClick={() => setSelectedOption("ligacao")}
              >
                <img src={withBasePath("/tel-icon.png")} alt="Botão ligação" />
                <div className="text-center">
                  <p className="font-bold text-[#0568A9] mb-1">A gente liga para você</p>
                  <p className="text-xs max-w-[180px] m-auto">
                    Receba uma ligação e contrate um plano por telefone
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
