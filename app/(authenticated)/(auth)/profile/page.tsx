
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

  return <p>{session?.user?.name}</p>;
};

export default ProfilePage;
