import React from 'react';
import AchievementPage from '@/components/Pages/ProfilePage/Achievements';

type Props = {
	params: { id: string };
};

export default async function AchievementsUserPage(props: Props) {
	return <AchievementPage {...props} />;
}
