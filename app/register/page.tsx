'use client';

import { useRouter } from 'next/navigation';
import PocketBaseRegisterForm from '@/components/auth/PocketBaseRegisterForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gaming-purple-light">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Register a new PocketBase account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PocketBaseRegisterForm />
        </CardContent>
        <CardContent className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-gaming-cyan-light hover:underline"
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}