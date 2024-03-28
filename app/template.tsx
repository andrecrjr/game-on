// template.tsx
import Header, { HeaderNotLogged } from '@/components/Header'
import React from 'react'


export type TemplateProps = {
  data: any // os dados da página
  children:React.ReactNode
}

const Template: React.FC<TemplateProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  )
}

export default Template
