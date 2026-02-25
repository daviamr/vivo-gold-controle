function Index({ step }: CheckoutStepsProps) {
  const conditional =
    (step === 1) ? 'w-[25%]' :
      (step === 2) ? 'w-[50%]' :
        (step === 3) ? 'w-[75%]' :
          (step === 4) ? 'w-[100%]' : 'w-0'

  const liDefaultStyle = `relative flex justify-center items-center m-auto rounded-full w-9 h-9 shadow`
  const spanDefaultStyle = `absolute text-sm`
  return (
    <div className="relative max-w-180 top-0 m-auto">
      <ul className="grid grid-cols-4 text-center text-gray-600">
        <li
          className={`${liDefaultStyle} ${(step >= 1 ? 'bg-default-purple text-white font-bold' : 'bg-white')}`}>
          1
          <span
            className={`${spanDefaultStyle} -bottom-8 ${(step >= 1 && 'text-default-purple font-bold')}`}>
            Titular
          </span>
        </li>
        <li
          className={`${liDefaultStyle} ${(step >= 2 ? 'bg-default-purple text-white font-bold' : 'bg-white')}`}>
          2
          <span
            className={`${spanDefaultStyle} -bottom-8 ${(step >= 2 && 'text-default-purple font-bold')}`}>
            Instalação
          </span>
        </li>
        <li
          className={`${liDefaultStyle} ${(step >= 3 ? 'bg-default-purple text-white font-bold' : 'bg-white')}`}>
          3
          <span
            className={`${spanDefaultStyle} -bottom-8 ${(step >= 3 && 'text-default-purple font-bold')}`}>
            Agendamento
          </span>
        </li>
        <li
          className={`${liDefaultStyle} ${(step === 4 ? 'bg-default-purple text-white font-bold' : 'bg-white')}`}>
          4
          <span
            className={`${spanDefaultStyle} -bottom-8 ${(step >= 4 && 'text-default-purple font-bold')}`}>
            Confirmação
          </span>
        </li>
      </ul>
      <div className={`bg-default-purple h-1 absolute top-4 duration-300 -z-5 ${conditional}`} />
      <div className="bg-[#dee2e6] w-full h-1 absolute top-4 -z-10" />
    </div>
  )
}

export default Index

type CheckoutStepsProps = {
  step: number
}