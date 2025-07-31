import GameGenericPage from '@/components/Pages/GamePage';
import React from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

const GamePage = async (props: Props) => {
  const { id } = await props.params;
  return (
    <>
      <GameGenericPage params={{ id }} />
    </>
  );
};

export default GamePage;
