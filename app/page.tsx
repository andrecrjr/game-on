import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/services/steamAuth';

import HeroBanner from '@/components/Herobanner';

export default async function Home() {
  const session = await getServerSession(getAuthOptions(undefined));

  if (session) {
    redirect('/trends');
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 relative overflow-hidden">
        {/* Gaming background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-500/5"></div>
        </div>

        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>

        <div className="relative z-10">
          <HeroBanner />
        </div>
      </main>
    </>
  );
}
