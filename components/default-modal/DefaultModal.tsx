'use client'
import { useEffect } from "react"

function Index({ children, bg = false, bgBlack = false, isOpen = true }: DefaultModalProps) {

  useEffect(() => {
    isOpen ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return (<div />)

  return (
    <div className={`fixed z-10 h-screen w-full flex justify-center items-center p-4 ${bg && 'bg-[#f2f2f2]'} ${bgBlack && 'absolute w-full left-0 bg-black/90'}`}>
      {children}
    </div>
  )
}

export default Index

type DefaultModalProps = {
  children: any,
  bgBlack?: boolean,
  isOpen?: boolean,
  bg?: boolean
}