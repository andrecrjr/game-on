import React from 'react'
import { HeaderNotLogged, Header } from '@/components/Header'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/app/services/steamAuth';


export type TemplateProps = {
  data: any // os dados da página
  children:React.ReactNode
}

const Template: React.FC<TemplateProps> = async({ children }) => {
  const session = await getServerSession(getAuthOptions(undefined))
  
  return (
    <>
      {!session ? <HeaderNotLogged /> : <Header />}
      {children}
    </>
  )
}

export default Template
