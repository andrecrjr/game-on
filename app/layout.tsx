import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import SessionContext from '@/components/context/SessionContext';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from './services/steamAuth';
import { Footer } from '@/components/Footer';

const inter = Space_Grotesk({ subsets: ['latin'] });

export async function generateMetadata() {
  const session = await getServerSession(getAuthOptions(undefined));
  if (session)
    return {
      title: `${session?.user.name}'s Page`,
      description: `Game's Library from ${session?.user.name}`,
    };
  return {
    title: 'Gamer On - Minimalist Steam Watcher',
    description: 'Steam User Data Watcher',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SessionContext>{children}</SessionContext>
        <Footer />
      </body>
    </html>
  );
}
