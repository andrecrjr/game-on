import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import React from 'react';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';
import ProfileIcon from '../icons/UserProfile';
import AchievementIcon from '../icons/Achievement';
import { HomeIcon, TrendingUp } from 'lucide-react';

const LeftMenuNotLogged = () => {
  return (
    <>
      <NavigationMenu className="w-full">
        <NavigationMenuList className="max-w-full flex">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className={navigationMenuTriggerStyle()}
            >
              <HomeIcon width={20} />
              <p className="text-sm md:text-xs md:ml-1 hidden md:block">Home</p>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/trends"
              className={navigationMenuTriggerStyle()}
            >
              <TrendingUp width={20} />
              <p className="text-sm md:text-xs md:ml-1 hidden md:block">
                Trending Game
              </p>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

const LeftMenu: React.FC = () => {
  return (
    <>
      <NavigationMenu className="w-full">
        <NavigationMenuList className="max-w-full flex">
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/profile"
            >
              <ProfileIcon />
              <p className="text-sm md:text-xs md:ml-1 hidden md:block">
                Profile
              </p>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/trends"
              className={navigationMenuTriggerStyle()}
            >
              <TrendingUp width={20} />
              <p className="text-sm md:text-xs md:ml-1 hidden md:block">
                Trending Game
              </p>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/profile/achievements/1"
            >
              <AchievementIcon />
              <p className="text-sm md:text-xs md:ml-1 hidden md:block">
                Achievements
              </p>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export { LeftMenu, LeftMenuNotLogged };
