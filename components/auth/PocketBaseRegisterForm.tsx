'use client';

import { useRouter } from 'next/navigation';
import PocketBase from 'pocketbase';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PocketBaseRegisterFormProps {
  onRegisterSuccess?: () => void;
}

export default function PocketBaseRegisterForm({
  onRegisterSuccess,
}: PocketBaseRegisterFormProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

      // Create the user
      const data = {
        email,
        emailVisibility: true,
        username,
        password,
        passwordConfirm: confirmPassword,
      };

      const record = await pb.collection('user_acjr').create(data);

      // Send verification email
      // await pb.collection('user_acjr').requestVerification(email);

      setSuccess(true);

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-green-400 py-4">
          Account created successfully! Please check your email to verify your
          account.
        </div>
        <Button
          onClick={() => router.push('/login')}
          className="w-full bg-gaming-purple-light hover:bg-gaming-purple-glow text-white"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-gray-300">
          Email
        </Label>
        <Input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="your@email.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-username" className="text-gray-300">
          Username
        </Label>
        <Input
          id="register-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="your_username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password" className="text-gray-300">
          Password
        </Label>
        <Input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="••••••••"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-confirmPassword" className="text-gray-300">
          Confirm Password
        </Label>
        <Input
          id="register-confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <div className="text-red-400 text-sm text-center py-2">{error}</div>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gaming-purple-light hover:bg-gaming-purple-glow text-white"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
