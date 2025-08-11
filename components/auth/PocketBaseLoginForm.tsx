'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PocketBaseLoginFormProps {
  onLoginSuccess?: () => void;
}

export default function PocketBaseLoginForm({ onLoginSuccess }: PocketBaseLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('pocketbase', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          router.push('/trends');
          router.refresh();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="your@email.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <div className="text-red-400 text-sm text-center py-2">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gaming-purple-light hover:bg-gaming-purple-glow text-white"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}