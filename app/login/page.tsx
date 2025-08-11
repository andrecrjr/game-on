'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import PocketBaseLoginForm from '@/components/auth/PocketBaseLoginForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gaming-purple-light">
            ACJR Login
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Sign in to your ACJR account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PocketBaseLoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-gaming-cyan-light hover:underline"
            >
              Register
            </button>
          </div>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => signIn('steam')}
            className="w-full bg-green-600 hover:bg-green-500 text-white"
          >
            Sign in with Steam
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
