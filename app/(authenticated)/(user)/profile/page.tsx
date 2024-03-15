
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { convertTiming } from '@/app/utils';
import { getMostPlayedOwnedGames } from '@/app/services';
import Column from '@/components/Grid/Column';
import Grid from '@/components/Grid';
import { AvatarFallback, AvatarImage, Avatar } from '@/components/ui/avatar';

interface IProfilePage {
}

const ProfilePage: React.FunctionComponent<IProfilePage> = async() => {
  
  const session = await getServerSession(getAuthOptions(undefined))
  const {mostPlayedData, mostPlayedTime,} = await getMostPlayedOwnedGames(session?.user?.ownedgames)
  
  if(!session){
    redirect("/")
  }
  console.log(session)
  
  
  return (<Grid className='flex-col-reverse md:divide-x-2 md:divide-gray-200'>
            <Column className='md:w-9/12'>
                <h2>Last Achievements</h2>
                <h2>All Achievements</h2>
            </Column>
            <Column className='md:w-3/12 flex flex-col align-center justify-center md:pl-8'>
                <h1 className='text-2xl text-center text-gray-800'>{session?.user?.name}</h1>
                <Avatar className='w-24 h-24 self-center mt-2'>
                        <AvatarImage src={session?.user?.steam.avatarfull} alt={session?.user?.username} />
                        <AvatarFallback>{session?.user?.username}</AvatarFallback>
                    </Avatar>
                <h2 className='mt-8 font-bold'>Favorite Game:</h2>
                <Image className='mt-2' src={session.user.ownedgames && mostPlayedData.avatarHeader} alt={ mostPlayedData.name} width={200} height={60}/>
                <p className="text-sm text-gray-600 mt-2"><strong>{session?.user?.ownedgames && mostPlayedData.name}</strong></p>
                <p className="text-sm text-gray-600">Time Played: {convertTiming(mostPlayedTime.playtime_forever)}</p>
            </Column>
        </Grid>);
};

export default ProfilePage;
