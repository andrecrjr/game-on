
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

interface IProfilePage {
}

const ProfilePage: React.FunctionComponent<IProfilePage> = async() => {
  
  const session = await getServerSession(getAuthOptions(undefined))
  
  if(!session){
    redirect("/")
  }
  console.log(session)
  return (<div className="bg-white shadow-lg rounded-lg p-6">
  <div className="flex items-center space-x-6 mb-4">
    <img className="h-24 w-24 rounded-full" src={session?.user?.image} alt="Foto do perfil"/>
    <div>
      <p className="text-xl text-gray-700 font-bold">{session?.user?.name}</p>
      <p className="text-gray-500">Steam ID: {session?.user?.account?.steamId}</p>
      <p className="text-gray-600">Jogo Favorito: nome_do_jogo</p>
    </div>
  </div>
  <div>
    <p className="text-gray-700">Total de Horas Jogadas: horas_jogadas</p>
    <p className="text-gray-700">Total de Jogos na Biblioteca: {session?.user?.ownedgames?.game_count}</p>
  </div>
</div>);
};

export default ProfilePage;
