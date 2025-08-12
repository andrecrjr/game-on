import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/services/steamAuth';

export async function GET(req: NextRequest) {
  // 1. Verify NextAuth session
  const session = await getServerSession(getAuthOptions());
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Generate state JWT
  const userId = session.user.email || session.user.pocketbaseRecord?.id;
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID not found in session' },
      { status: 400 },
    );
  }
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const statePayload = {
    userId,
    provider: 'steam',
    nonce,
    timestamp,
  };
  const state = jwt.sign(statePayload, process.env.NEXT_AUTH_SECRET!, {
    expiresIn: '10m',
  });

  // 3. Build Steam OpenID auth URL
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: 'Missing BASE_URL' },
      { status: 500 },
    );
  }
  const redirectUri = `${baseUrl}/api/link/steam/callback`;
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': `${redirectUri}?state=${state}`,
    'openid.realm': baseUrl,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });

  const steamAuthUrl = `https://steamcommunity.com/openid/login?${params.toString()}`;

  // 4. Redirect to Steam
  return NextResponse.redirect(steamAuthUrl, 302);
}