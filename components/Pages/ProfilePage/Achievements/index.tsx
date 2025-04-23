import { getAuthOptions } from '@/app/services/steamAuth';
import { getUserAchievementPaginated } from '@/app/services';
import AchievementsTable from '@/components/Tables/AchievementsTable';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { PaginationAchivements } from './PaginationAchivements';

type Props = {
  params: { id: string };
};

export default async function AchievementPage({ params }: Props) {
  const session = await getServerSession(getAuthOptions(undefined));
  const { achievements, currentPage, totalPages } =
    await getUserAchievementPaginated(
      session?.user?.gamesLibraryData.ownedGames || [],
      session?.user.steam.steamid || '',
      parseInt(params?.id) || 1,
    );
  if (achievements.length > 0)
    return (
      <section className="flex flex-col w-screen md:w-auto md:pr-6">
        <h4 className="mb-4 pl-4">
          Achievements - Page {currentPage} of {totalPages}
        </h4>
        <section className="flex justify-between px-4 pb-4">
          <PaginationAchivements id={params.id} totalPages={totalPages} />
        </section>
        <section className="px-4">
          <AchievementsTable achievements={achievements} />
        </section>
      </section>
    );

  return <p>No games found</p>;
}
