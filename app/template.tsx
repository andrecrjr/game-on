import React from 'react';
import { HeaderNotLogged, Header } from '@/components/Header';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/services/steamAuth';


export type TemplateProps = {
  data?: unknown // Optional data for the page with more type-safe unknown instead of any
  children: React.ReactNode
}

const Template = async({ children }: TemplateProps): Promise<JSX.Element> => {
  const session = await getServerSession(getAuthOptions());
  
  return (
    <>
      {!session ? <HeaderNotLogged /> : <Header />}
      {children}
    </>
  );
};

export default Template;
