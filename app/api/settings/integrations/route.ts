import { NextRequest, NextResponse } from 'next/server';
import { connectRetroAchievementsAccount } from '@/app/services/retroAchievements';

export async function POST(request: NextRequest) {
  const { integrationId, username, apiKey } = await request.json();
  console.log('integrationId', integrationId);
  console.log('username', username);
  console.log('apiKey', apiKey);
  let success = false;
  if (integrationId === 'retroachievements') {
    success = await connectRetroAchievementsAccount(username, apiKey);
  }

  if (success) {
    return NextResponse.json({ success }, { status: 200 });
  } else {
    return NextResponse.json(
      { error: 'Failed to connect to integration' },
      { status: 500 },
    );
  }
}
