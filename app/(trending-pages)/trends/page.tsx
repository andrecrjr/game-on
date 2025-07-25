import React from 'react';
import { getTrendingGamesRanked } from '@/app/services';
import TrendingGamePage from '@/components/Pages/TrendingGamePage';

const TrendingPage = async () => {
  const data = await getTrendingGamesRanked();
  return <TrendingGamePage gameRankedData={data} />;
};

export default TrendingPage;
