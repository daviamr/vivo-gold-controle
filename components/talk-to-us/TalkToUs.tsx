'use client'

import { X } from "lucide-react"
import { useState } from "react"
import { withMask } from "use-mask-input"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { sendTalkToUsMessage } from "@/lib/api/messages"

export default function TalkToUs({ setIsTalkToUsOpen }: { setIsTalkToUsOpen: (isOpen: boolean) => void }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setSubmitError(null)

    try {
      const { data } = await sendTalkToUsMessage({ name, phone, email, message })

      if (data.success) {
        setShowSuccessMessage(true)
        return
      }

      setSubmitError("Não foi possível enviar sua mensagem. Tente novamente.")
    } catch {
      setSubmitError("Não foi possível enviar sua mensagem. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center text-[#3F3F3F] overflow-y-auto">
      <div className="relative bg-white p-4 px-6 rounded-md w-full max-w-120 min-h-[443px] mx-2 flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <X size={20} color="#3F3F3F" onClick={() => setIsTalkToUsOpen(false)} className="cursor-pointer" />
        </div>

        {showSuccessMessage ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 w-full">
            <p className="text-[18px] font-bold">Mensagem enviada com sucesso</p>
            <p className="text-[14px] max-w-[250px]">Sua solicitação foi recebida e será analisada pela nossa equipe. Retornaremos em breve.</p>
          </div>
        ) : (
          <div className="w-full">
            <h1 className="text-[20px] font-bold mt-4">Fale conosco</h1>
            <p className="text-[14px] mb-6">Envie sua mensagem e retornaremos o mais breve possível.</p>
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="col-span-2">
                <Label htmlFor="name" className="text-xs mb-1">Nome Completo</Label>
                <Input
                  type="text"
                  id="name"
                  className="rounded-sm py-5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="tel" className="text-xs mb-1">Telefone</Label>
                <Input
                  id="tel"
                  type="text"
                  className="rounded-sm py-5"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  ref={withMask("(99) 9 9999-9999", {
                    placeholder: "",
                    showMaskOnHover: false,
                    showMaskOnFocus: false,
                  })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email" className="text-xs mb-1">E-mail</Label>
                <Input
                  type="email"
                  id="email"
                  className="rounded-sm py-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="message" className="text-xs mb-1">Mensagem</Label>
                <Textarea
                  id="message"
                  className="rounded-sm py-2"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              {submitError && (
                <p className="col-span-2 text-xs text-red-600">{submitError}</p>
              )}
              <div className="col-span-2 mt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-6 bg-[#D53065] font-bold rounded-full disabled:opacity-70 text-white"
                >
                  {isLoading ? "Enviando..." : "Enviar mensagem"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
