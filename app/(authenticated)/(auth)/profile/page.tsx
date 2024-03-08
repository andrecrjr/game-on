
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { convertTiming, getMostPlayedOwnedGames } from '@/app/utils';

interface IProfilePage {
}

const ProfilePage: React.FunctionComponent<IProfilePage> = async() => {
  
  const session = await getServerSession(getAuthOptions(undefined))
  const {mostPlayedData, mostPlayedTime} = await getMostPlayedOwnedGames(session?.user?.ownedgames)
  
  if(!session){
    redirect("/")
  }
  return (<div className="bg-white shadow-lg rounded-lg p-6">
  <div className="flex items-center space-x-6 mb-4">
    <Image className="h-24 w-24 rounded-full" 
        src={session?.user?.image||""} width="96" height="96" alt="Foto do perfil"/>
    <div>
      <p className="text-xl text-gray-700 font-bold">{session?.user?.name}</p>
      <p className="text-gray-600">Jogo Favorito: {session?.user?.ownedgames && mostPlayedData.name}</p>
    </div>
  </div>
  <div>
    <p className="text-gray-700">Total de Horas Jogadas: {convertTiming(mostPlayedTime.playtime_forever)}</p>
    <p className="text-gray-700">Total de Jogos na Biblioteca: {session?.user?.ownedgames?.game_count}</p>
  </div>
</div>);
};

export default ProfilePage;
