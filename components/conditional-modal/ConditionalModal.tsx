'use client'

import { usePathname } from 'next/navigation'
import ModalPfPj from '../modal-pf-pj/ModalPfPj'

function Index() {
  const pathname = usePathname()

  const conditional =
    (pathname.endsWith('/checkout') ||
      pathname.endsWith('/unavailable') ||
      pathname.endsWith('/available'))

  if (conditional) return null

  return <ModalPfPj />
}

export default Index