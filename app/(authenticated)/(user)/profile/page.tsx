
import Column from '@/components/Grid/Column';
import Grid from '@/components/Grid';
import ColumnProfile from '@/components/Profile';
import LibraryTable from '@/components/Tables/Library';


const ProfilePage: React.FunctionComponent = async() => {
  
  
  
  return (<Grid className='flex-col-reverse md:divide-x-2 md:divide-gray-200 relative'>
            <Column className='md:w-9/12 '>
                <LibraryTable/>
                <h2>Last Achievements</h2>
                <h2>All Achievements</h2>
            </Column>
            <ColumnProfile/>
        </Grid>);
};

export default ProfilePage;
