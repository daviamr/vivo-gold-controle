'use client'

import { useState } from "react"

function Index() {
  const [menuOption, setMenuOption] = useState('test')

  return (
    <div>
      <ul className="grid grid-cols-2 max-w-70 text-center cursor-pointer">
        <li
          className={`border-b-3 ${(menuOption === 'test' && 'border-default-purple')}`}
          onClick={() => setMenuOption('test')}>
          Fibra + Pós
        </li>

        <li
          className={`border-b-3 ${(menuOption === 'test2' && 'border-default-purple')}`}
          onClick={() => setMenuOption('test2')}>
          Fibra + Pós + PF
        </li>
      </ul>

      <div className="w-full h-20 flex justify-center items-center border-2 rounded-sm mt-4 text-center">
        Cards section
      </div>
    </div>
  )
}

export default Index