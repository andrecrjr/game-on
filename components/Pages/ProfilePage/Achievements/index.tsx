import { getServerSession } from 'next-auth';
import { getUserAchievementPaginated } from '@/app/services';
import { getAuthOptions } from '@/app/services/steamAuth';
import AchievementsTable from '@/components/Tables/AchievementsTable';
import { PaginationAchivements } from './PaginationAchivements';

type Props = {
  params: { id: string };
};

export default async function AchievementPage({ params }: Props) {
  const { id } = params;
  const session = await getServerSession(getAuthOptions(undefined));

  // Check if user is authenticated with Steam (has steamid)
  const steamId = session?.user?.steam?.steamid || '';
  
  // For PocketBase users (ACJR), return empty achievements
  if (!steamId) {
    return (
      <section className="flex flex-col w-screen md:w-auto md:pr-6">
        <h4 className="mb-4 pl-4">
          No achievements available - Steam account not linked
        </h4>
      </section>
    );
  }

  const { achievements, currentPage, totalPages } =
    await getUserAchievementPaginated(
      session?.user?.gamesLibraryData?.ownedGames || [],
      steamId,
      parseInt(id) || 1,
    );
  if (achievements.length > 0)
    return (
      <section className="flex flex-col w-screen md:w-auto md:pr-6">
        <h4 className="mb-4 pl-4">
          Achievements - Page {currentPage} of {totalPages}
        </h4>
        <section className="flex justify-between px-4 pb-4">
          <PaginationAchivements id={id} totalPages={totalPages} />
        </section>
        <section className="px-4">
          <AchievementsTable achievements={achievements} />
        </section>
      </section>
    );

  return <p>No games found</p>;
}
