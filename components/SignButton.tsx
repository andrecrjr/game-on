'use client';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {};

export default function SignButton({}: Props) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        onClick={() => router.push('/login')}
        className="bg-gaming-purple-light hover:bg-gaming-purple-glow mx-auto text-white px-6 py-3 rounded"
      >
        Sign In with PocketBase
      </Button>
      <Button
        onClick={() => router.push('/api/auth/signin/steam')}
        className="bg-green-600 hover:bg-green-500 mx-auto text-white px-6 py-3 rounded"
      >
        Sign In with Steam
      </Button>
    </div>
  );
}
