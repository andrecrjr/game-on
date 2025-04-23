import React from 'react';
import { TemplateProps } from '@/app/template';

import Grid from '@/components/Grid';
import Column from '@/components/Grid/Column';
import AsideColumnProfile from '@/components/Pages/ProfilePage/ColumnProfile';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '../services/steamAuth';
import { redirect } from 'next/navigation';

export default async function Template({ children }: TemplateProps) {
  const session = await getServerSession(getAuthOptions(undefined));
  if (!session) {
    return redirect('/');
  }
  return (
    <>
      <main className="pt-10 mx-auto w-full">
        <Grid className="flex-col-reverse md:divide-x-2 md:divide-gray-200 relative">
          <Column className="md:w-9/12">{children}</Column>
          <AsideColumnProfile />
        </Grid>
      </main>
    </>
  );
}
