'use client'

import { UseFormReturn } from "react-hook-form";

function Index({ form, customerData }: SecondStepProps) {
  const { formState: { errors } } = form

  return (
    <div className="mt-8">
      <div className="bg-gray-200 p-4 rounded-sm">
        <span className="text-sm p-2 opacity-75">E-mail</span>
        <p className="text-1xl opacity-75">{customerData?.firstStepData?.email}</p>
      </div>
    </div>
  )
}

export default Index

type SecondStepProps = {
  form: UseFormReturn<any>,
  customerData: any
}