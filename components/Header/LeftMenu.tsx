import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import { HomeIcon, TrendingUp } from 'lucide-react';
import React from 'react';
import AchievementIcon from '../icons/Achievement';
import ProfileIcon from '../icons/UserProfile';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';

const LeftMenuNotLogged = () => {
  return (
    <>
      <NavigationMenu className="w-full">
        <NavigationMenuList className="max-w-full flex space-x-gaming">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className="group relative inline-flex h-10 w-max items-center justify-center rounded-gaming bg-gradient-to-r from-gaming-purple-light/20 to-gaming-cyan-light/20 px-4 py-2 text-gaming-sm font-medium text-gaming-text-secondary transition-all duration-300 hover:from-gaming-purple-light/40 hover:to-gaming-cyan-light/40 hover:text-gaming-text-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gaming-purple-light/50 focus:ring-offset-2 focus:ring-offset-gaming-background-primary shadow-gaming hover:shadow-gaming-lg"
            >
              <div className="absolute inset-0 rounded-gaming bg-gradient-to-r from-gaming-purple-glow/20 to-gaming-cyan-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <HomeIcon
                width={20}
                className="relative z-10 text-gaming-purple-light group-hover:text-gaming-purple-glow transition-colors"
              />
              <p className="text-gaming-sm md:text-gaming-xs md:ml-2 hidden md:block relative z-10">
                Home
              </p>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/trends"
              className="group relative inline-flex h-10 w-max items-center justify-center rounded-gaming bg-gradient-to-r from-gaming-purple-light/20 to-gaming-cyan-light/20 px-4 py-2 text-gaming-sm font-medium text-gaming-text-secondary transition-all duration-300 hover:from-gaming-purple-light/40 hover:to-gaming-cyan-light/40 hover:text-gaming-text-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gaming-purple-light/50 focus:ring-offset-2 focus:ring-offset-gaming-background-primary shadow-gaming hover:shadow-gaming-lg"
            >
              <div className="absolute inset-0 rounded-gaming bg-gradient-to-r from-gaming-purple-glow/20 to-gaming-cyan-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <TrendingUp
                width={20}
                className="relative z-10 text-gaming-cyan-light group-hover:text-gaming-cyan-glow transition-colors"
              />
              <p className="text-gaming-sm md:text-gaming-xs md:ml-2 hidden md:block relative z-10">
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
        <NavigationMenuList className="max-w-full flex space-x-gaming">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/trends"
              className="group relative inline-flex h-10 w-max items-center justify-center rounded-gaming bg-gradient-to-r from-gaming-purple-light/20 to-gaming-cyan-light/20 px-4 py-2 text-gaming-sm font-medium text-gaming-text-secondary transition-all duration-300 hover:from-gaming-purple-light/40 hover:to-gaming-cyan-light/40 hover:text-gaming-text-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gaming-purple-light/50 focus:ring-offset-2 focus:ring-offset-gaming-background-primary shadow-gaming hover:shadow-gaming-lg"
            >
              <div className="absolute inset-0 rounded-gaming bg-gradient-to-r from-gaming-purple-glow/20 to-gaming-cyan-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <TrendingUp
                width={20}
                className="relative z-10 text-gaming-cyan-light group-hover:text-gaming-cyan-glow transition-colors"
              />
              <p className="text-gaming-sm md:text-gaming-xs md:ml-2 hidden md:block relative z-10">
                Trending Game
              </p>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className="group relative inline-flex h-10 w-max items-center justify-center rounded-gaming bg-gradient-to-r from-gaming-purple-light/20 to-gaming-cyan-light/20 px-4 py-2 text-gaming-sm font-medium text-gaming-text-secondary transition-all duration-300 hover:from-gaming-purple-light/40 hover:to-gaming-cyan-light/40 hover:text-gaming-text-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gaming-purple-light/50 focus:ring-offset-2 focus:ring-offset-gaming-background-primary shadow-gaming hover:shadow-gaming-lg"
              href="/profile/achievements/1"
            >
              <div className="absolute inset-0 rounded-gaming bg-gradient-to-r from-gaming-purple-glow/20 to-gaming-cyan-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <div className="relative z-10 text-gaming-purple-light group-hover:text-gaming-purple-glow transition-colors">
                <AchievementIcon />
              </div>
              <p className="text-gaming-sm md:text-gaming-xs md:ml-2 hidden md:block relative z-10">
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
