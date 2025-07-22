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
  const userId = session.user.email;
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
    provider: 'microsoft',
    nonce,
    timestamp,
  };
  const state = jwt.sign(statePayload, process.env.NEXT_AUTH_SECRET!, {
    expiresIn: '10m',
  });

  // 3. Build Microsoft auth URL
  const clientId = process.env.AUTH_MICROSOFT_ENTRA_ID_ID;
  const baseUrl = process.env.BASE_URL;
  if (!clientId || !baseUrl) {
    return NextResponse.json(
      { error: 'Missing Microsoft client ID or BASE_URL' },
      { status: 500 },
    );
  }
  const redirectUri = `${baseUrl}/api/link/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email XboxLive.signin offline_access',
    response_type: 'code',
    state,
  });
  const microsoftAuthUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${params.toString()}`;

  // 4. Redirect to Microsoft auth URL
  return NextResponse.redirect(microsoftAuthUrl, 302);
}
