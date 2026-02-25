'use client'

import { Label } from "../ui/label";
import { Controller, UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getTwoWeeksDate } from "@/lib/helpers/formatters";

function Index({ form }: SecondStepProps) {
  const { formState: { errors }, control, } = form
  const dates = getTwoWeeksDate()

  return (
    <div className="mt-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="font-light mb-4">1&ordf; opção</p>
          <Label className="text-1xl font-normal mb-1" htmlFor="primaryDate">Data</Label>
          <Controller
            name="primaryDate"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="primaryDate" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {dates.map((date, i) => (
                    <SelectItem
                      value={date.data}
                      key={i}
                      disabled={i < 2}>
                      {date.data} - {date.weekDay} {i < 2 && '(Esgotado)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
            {errors.primaryDate && (
            <p className="text-red-500 text-sm mt-1">{String(errors.primaryDate.message)}</p>)}


          <div className="mt-4">
            <Label className="text-1xl font-normal mb-1" htmlFor="primaryPeriod">Período</Label>
            <Controller
              name="primaryPeriod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="primaryPeriod" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">
                      Manhã
                    </SelectItem>
                    <SelectItem value="afternoon">
                      Tarde
                    </SelectItem>
                  </SelectContent>
                </Select>
              )} />
              {errors.primaryPeriod && (
            <p className="text-red-500 text-sm mt-1">{String(errors.primaryPeriod.message)}</p>)}
          </div>

        </div>

        <div>
          <p className="font-light mb-4">2&ordf; opção</p>
          <Label className="text-1xl font-normal mb-1" htmlFor="secondaryDate">Data</Label>
          <Controller
            name="secondaryDate"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="secondaryDate" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {dates.map((date, i) => (
                    <SelectItem
                      value={date.data}
                      key={i}
                      disabled={i < 2}>
                      {date.data} - {date.weekDay} {i < 2 && '(Esgotado)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
            {errors.secondaryDate && (
            <p className="text-red-500 text-sm mt-1">{String(errors.secondaryDate.message)}</p>)}

          <div className="mt-4">
            <Label className="text-1xl font-normal mb-1" htmlFor="secondaryPeriod">Período</Label>
            <Controller
              name="secondaryPeriod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="secondaryPeriod" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">
                      Manhã
                    </SelectItem>
                    <SelectItem value="afternoon">
                      Tarde
                    </SelectItem>
                  </SelectContent>
                </Select>
              )} />
              {errors.secondaryPeriod && (
            <p className="text-red-500 text-sm mt-1">{String(errors.secondaryPeriod.message)}</p>)}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Index

type SecondStepProps = {
  form: UseFormReturn<any>,
}