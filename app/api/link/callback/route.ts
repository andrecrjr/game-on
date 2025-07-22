import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

const MICROSOFT_TOKEN_URL =
  'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.json(
      { error: 'Missing code or state' },
      { status: 400 },
    );
  }

  // 1. Verify and decode state JWT
  let statePayload;
  try {
    statePayload = jwt.verify(state, process.env.NEXT_AUTH_SECRET!);
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid or expired state' },
      { status: 400 },
    );
  }
  const { userId, provider, nonce } = statePayload as any;
  if (!userId || provider !== 'microsoft') {
    return NextResponse.json(
      { error: 'Invalid state payload' },
      { status: 400 },
    );
  }

  // 2. Exchange code for tokens
  const params = new URLSearchParams({
    client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
    client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
    code,
    redirect_uri: `${process.env.BASE_URL}/api/link/callback`,
    grant_type: 'authorization_code',
  });
  let tokenResponse;
  try {
    tokenResponse = await fetch(MICROSOFT_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch Microsoft token' },
      { status: 500 },
    );
  }
  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    return NextResponse.json(
      { error: 'Microsoft token error', details: error },
      { status: 500 },
    );
  }
  const tokenData = await tokenResponse.json();
  const { access_token, refresh_token, id_token, expires_in } = tokenData;
  if (!access_token) {
    return NextResponse.json(
      { error: 'No access token from Microsoft' },
      { status: 500 },
    );
  }

  // 3. Decode ID token to get user info
  let userInfo;
  try {
    const decodedToken = jwt.decode(id_token) as any;
    if (decodedToken) {
      userInfo = {
        id: decodedToken.sub || decodedToken.oid,
        email: decodedToken.email,
        name: decodedToken.name,
        given_name: decodedToken.given_name,
        family_name: decodedToken.family_name,
      };
    }
  } catch (err) {
    console.log('Failed to decode ID token');
  }

  const provider_id = userInfo?.id || userId; // Fallback to userId if no provider_id
  console.log(userInfo);

  const pb = new PocketBase(process.env.POCKETBASE_URL!);
  try{
        await pb.collection('users').authWithPassword(
      process.env.PB_ADMIN_USER!,
      process.env.PB_ADMIN_PASS!,
    );
  } catch (e) {
    console.log(e);
  }

  // Find existing record
  let existing;
  try {
    console.log('PocketBase admin auth successful');
    existing = await pb
      .collection('linked_accounts_gameon')
      .getFirstListItem(`user="${userId}" && provider="microsoft"`);
    console.log(existing);
  } catch (e) {
    existing = null;
    console.log(e);
  }
  const credentials = JSON.stringify({
    access_token,
    refresh_token,
    id_token,
    expires_in,
  });
  const provider_data = {
    microsoft: userInfo,
  };
  const record = {
    user: userId,
    provider: 'microsoft',
    provider_id,
    credentials,
    provider_data,
    is_active: true,
    is_verified: true,
    expires_at: expires_in
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : null,
    token_updated_at: new Date().toISOString(),
  };
  
  console.log('PocketBase record:', record);
  try {
    if (existing) {
      await pb.collection('linked_accounts_gameon').update(existing.id, record);
    } else {
      await pb.collection('linked_accounts_gameon').create(record);
    }
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to upsert PocketBase', details: String(err) },
      { status: 500 },
    );
  }

  // 6. Redirect to integrations/settings page
  return NextResponse.redirect(
    `${process.env.BASE_URL}/profile/settings?integration=success`,
    302,
  );
}
