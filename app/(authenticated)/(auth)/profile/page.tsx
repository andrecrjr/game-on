
import { getServerSession } from 'next-auth';
import * as React from 'react';
import { getAuthOptions } from '../../api/auth/[...nextauth]/route';

interface IProfilePage {
}

const ProfilePage: React.FunctionComponent<IProfilePage> = async() => {
  // @ts-ignore
  const data = await getServerSession(getAuthOptions())
  console.log("dados", data)
  return <p>user</p>;
};

export default ProfilePage;
