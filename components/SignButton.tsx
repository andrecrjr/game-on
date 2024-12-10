'use client';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

type Props = {};

export default function SignButton({}: Props) {
    
    
  return <Button onClick={()=>signIn('steam')} className="bg-green-600 hover:bg-green-500 mx-auto text-white px-6 py-3 mt-6 rounded">
            Sign In
          </Button>;
}
