import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/services/steamAuth';
import { redirect } from 'next/navigation';

import HeroBanner from '@/components/Herobanner';

export default async function Home() {
  const session = await getServerSession(getAuthOptions(undefined));

  if (session) {
    redirect('/profile');
  }

  return (
    <>
      <main className="flex flex-col items-center justify-between md:p-14">
        <HeroBanner />
      </main>
    </>
  );
}
