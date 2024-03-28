// template.tsx
import { HeaderNotLogged, Header } from '@/components/Header'
import { getServerSession } from 'next-auth'
import React from 'react'
import { getAuthOptions } from './api/auth/[...nextauth]/route'


export type TemplateProps = {
  data: any // os dados da página
  children:React.ReactNode
}

const Template: React.FC<TemplateProps> = async({ children }) => {
  const session = await getServerSession(getAuthOptions(undefined))
  console.log(session)
  return (
    <>
      {!session ? <HeaderNotLogged /> : <Header />}
      {children}
    </>
  )
}

export default Template
