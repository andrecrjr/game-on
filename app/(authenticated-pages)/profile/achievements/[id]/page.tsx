import React from 'react';
import AchievementPage from '@/components/Pages/ProfilePage/Achievements';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AchievementsUserPage(props: Props) {
  const { id } = await props.params;
  return <AchievementPage params={{ id }} />;
}
