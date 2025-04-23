'use client';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

export default function SessionContext({ children }: Props) {
	return <SessionProvider>{children}</SessionProvider>;
}
