import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@radix-ui/react-navigation-menu';
import React from 'react';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';
import ProfileIcon from '../icons/UserProfile';
import AchievementIcon from '../icons/Achievement';
import { HomeIcon } from 'lucide-react';

// import { Container } from './styles';

export const LeftMenuNotLogged = () =>{
      return (<>
   <NavigationMenu className="w-full">
      <NavigationMenuList className='max-w-full flex'>
            <NavigationMenuItem>
                    <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                        <HomeIcon />
                        <p className='text-sm md:text-xs md:ml-1 hidden md:block'>Home</p>
                    </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu></>)
}

const LeftMenu: React.FC = () => {
  return <>
   <NavigationMenu className="w-full">
      <NavigationMenuList className='max-w-full flex'>
          <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/profile">
                        <ProfileIcon/>
                        <p className='text-sm md:text-xs md:ml-1 hidden md:block'>Profile</p>
                  </NavigationMenuLink>
          </NavigationMenuItem>
           <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/profile/achievements">
                        <AchievementIcon/>
                        <p className='text-sm md:text-xs md:ml-1 hidden md:block'>Achievements</p>
                  </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu></>;
}

export default LeftMenu;