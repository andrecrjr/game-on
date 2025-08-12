import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import PocketBase from 'pocketbase';
import { getAuthOptions } from '@/app/services/steamAuth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = await getServerSession(getAuthOptions(undefined));
  const pocketbaseId = session?.user.pocketbaseRecord?.id;
  const steamId = session?.user.steam?.steamid;
  const currentUserId = pocketbaseId || steamId; // Support both PocketBase and Steam users
  const state = searchParams.get('state');

  if (!state) {
    return NextResponse.json(
      { error: 'Missing state parameter' },
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
  if (!userId || provider !== 'steam') {
    return NextResponse.json(
      { error: 'Invalid state payload' },
      { status: 400 },
    );
  }

  // 2. Verify OpenID response
  const openidParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith('openid.')) {
      openidParams[key] = value;
    }
  }

  // Check if we have the required OpenID parameters
  if (!openidParams['openid.claimed_id'] || !openidParams['openid.sig']) {
    return NextResponse.json(
      { error: 'Invalid OpenID response' },
      { status: 400 },
    );
  }

  // 3. Verify the OpenID signature with Steam
  const verificationParams = {
    ...openidParams,
    'openid.mode': 'check_authentication',
  };

  const verificationUrl = 'https://steamcommunity.com/openid/login';
  const verificationBody = new URLSearchParams(verificationParams);

  let verificationResponse;
  try {
    verificationResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verificationBody.toString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to verify with Steam' },
      { status: 500 },
    );
  }

  const verificationResult = await verificationResponse.text();
  if (!verificationResult.includes('is_valid:true')) {
    return NextResponse.json(
      { error: 'Steam verification failed' },
      { status: 400 },
    );
  }

  // 4. Extract Steam ID from claimed_id
  const claimedId = openidParams['openid.claimed_id'];
  const steamIdMatch = claimedId.match(/\/id\/(\d+)$/);
  if (!steamIdMatch) {
    return NextResponse.json(
      { error: 'Could not extract Steam ID' },
      { status: 400 },
    );
  }
  const extractedSteamId = steamIdMatch[1];

  // 5. Get Steam user profile
  let steamProfile;
  try {
    const profileResponse = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_SECRET}&steamids=${extractedSteamId}`
    );
    const profileData = await profileResponse.json();
    steamProfile = profileData.response.players[0];
  } catch (err) {
    console.error('Failed to fetch Steam profile:', err);
    steamProfile = {
      steamid: extractedSteamId,
      personaname: 'Unknown',
      avatar: '',
      avatarfull: '',
    };
  }

  // 6. Store in PocketBase
  const pb = new PocketBase(process.env.POCKETBASE_URL!);
  try {
    await pb
      .collection('_superusers')
      .authWithPassword(process.env.PB_ADMIN_USER!, process.env.PB_ADMIN_PASS!);
  } catch (e) {
    console.log('PocketBase admin auth error:', e);
  }

  // Find existing record
  let existing;
  try {
    existing = await pb
      .collection('linked_accounts_gameon')
      .getFirstListItem(`user_id="${currentUserId}" && provider="steam"`);
  } catch (e) {
    existing = null;
    console.log('No existing Steam link found:', e);
  }

  const credentials = JSON.stringify({
    steamid: extractedSteamId,
    openid_claimed_id: claimedId,
    verification_timestamp: new Date().toISOString(),
  });

  const provider_data = {
    steam: steamProfile,
  };

  const record = {
    user: userId,
    user_id: String(currentUserId),
    provider: 'steam',
    provider_id: extractedSteamId,
    credentials,
    provider_data,
    is_active: true,
    is_verified: true,
    expires_at: null, // Steam OpenID doesn't expire
    token_updated_at: new Date().toISOString(),
  };

  try {
    if (existing) {
      await pb.collection('linked_accounts_gameon').update(existing.id, record);
    } else {
      await pb.collection('linked_accounts_gameon').create(record);
    }
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to store Steam link in database', details: String(err) },
      { status: 500 },
    );
  }

  // 7. Redirect to settings page
  return NextResponse.redirect(
    `${process.env.BASE_URL}/profile/settings?integration=success`,
    302,
  );
}