import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';
import { getAuthOptions } from '@/app/services/steamAuth';
import { TemplateProps } from '@/app/template';
import Grid from '@/components/Grid';
import Column from '@/components/Grid/Column';

export default async function Template({ children }: TemplateProps) {
  const session = await getServerSession(getAuthOptions(undefined));
  if (!session) {
    return redirect('/');
  }
  return (
    <>
      <main className="pt-10 mx-auto w-full">
        <Grid className="flex-col-reverse md:divide-gray-200 relative">
          <Column className="w-full">{children}</Column>
        </Grid>
      </main>
    </>
  );
}
