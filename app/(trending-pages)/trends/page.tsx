import { getTrendingGamesRanked } from "@/app/services";
import TrendingGamePage from "@/components/Pages/TrendingGamePage";
import React from "react";

type Props = {};

const TrendingPage = async (props: Props) => {
  const data = await getTrendingGamesRanked()
  return <TrendingGamePage gameRankedData={data} />;
};

export default TrendingPage