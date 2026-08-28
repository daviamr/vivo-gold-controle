"use client"

import { Suspense } from "react"
import { Loader } from "lucide-react"
import ResumePage from "@/components/edit/ResumePage"

function Fallback() {
  return (
    <div className="h-[calc(100vh-76px)] flex justify-center items-center">
      <Loader className="animate-spin" size={48} color="purple" />
    </div>
  )
}

export default function RetomarRoute() {
  return (
    <Suspense fallback={<Fallback />}>
      <ResumePage />
    </Suspense>
  )
}
