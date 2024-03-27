import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@radix-ui/react-navigation-menu';
import React from 'react';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';
import ProfileIcon from '../icons/UserProfile';
import AchievementIcon from '../icons/Achievement';

// import { Container } from './styles';

const LeftMenu: React.FC = () => {
  return <>
   <NavigationMenu className="w-full">
      <NavigationMenuList className='max-w-full flex'>
            <NavigationMenuItem>
                    <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/profile">
                        <ProfileIcon/>  
                        <p className='text-sm md:text-xs ml-3 md:ml-1'>Profile</p>
                  </NavigationMenuLink>
          </NavigationMenuItem>
           <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/profile/achievements">
                        <AchievementIcon/>  
                        <p className='text-sm md:text-xs ml-3 md:ml-1'>Achievements</p>
                  </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu></>;
}

export default LeftMenu;