import React from 'react';
import Settings from '@/components/Pages/ProfilePage/Settings';

type Props = {
  params: { id: string };
};

export default async function AchievementsUserPage(props: Props) {
  return <Settings />;
}
