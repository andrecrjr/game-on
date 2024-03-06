
import { getServerSession } from 'next-auth';
import * as React from 'react';

interface IProfilePage {
}

const ProfilePage: React.FunctionComponent<IProfilePage> = () => {
  const data = getServerSession()
  return <p>user</p>;
};

export default ProfilePage;
