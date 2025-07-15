import React from 'react';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenu,
} from '@radix-ui/react-navigation-menu';
import { signOut, useSession } from 'next-auth/react';
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import UserLogout from '../icons/UserLogout';

const RightMenu: React.FC = () => {
  const { status, data } = useSession();

  if (status === 'authenticated')
    return (
      <NavigationMenu className="">
        <NavigationMenuList className="flex">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="group relative inline-flex h-10 w-max items-center justify-center rounded-gaming bg-gradient-to-r from-gaming-purple-light/20 to-gaming-cyan-light/20 px-3 py-2 text-gaming-sm font-medium text-gaming-text-secondary transition-all duration-300 hover:from-gaming-purple-light/40 hover:to-gaming-cyan-light/40 hover:text-gaming-text-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gaming-purple-light/50 focus:ring-offset-2 focus:ring-offset-gaming-background-primary shadow-gaming hover:shadow-gaming-lg">
              <div className="absolute inset-0 rounded-gaming bg-gradient-to-r from-gaming-purple-glow/20 to-gaming-cyan-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <Avatar className="w-8 h-8 relative z-10 ring-2 ring-gaming-purple-light/30 group-hover:ring-gaming-purple-glow/50 transition-all duration-300">
                <AvatarImage
                  src={data?.user?.steam?.avatarmedium || ''}
                  alt={data.user?.username}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-gaming-purple-light to-gaming-cyan-light text-gaming-text-primary font-semibold">
                  {data.user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </NavigationMenuTrigger>
            <NavigationMenuContent
              className="transition-all duration-300 flex 
                            bg-gradient-to-br from-gaming-background-secondary/95
                             to-gaming-background-tertiary/95 backdrop-blur-md border 
                             border-gaming-purple-light/20 rounded-gaming shadow-gaming-xl z-50 top-full mt-3 flex-col
                                justify-center text-center min-w-[165px]"
            >
              {/* Gaming-style dropdown header */}
              <div className="p-3 border-b border-gaming-purple-light/20">
                <p className="text-gaming-sm text-gaming-purple-light font-medium">Welcome back,</p>
                <p className="text-gaming-lg text-gaming-text-primary font-bold truncate">{data.user?.username}</p>
              </div>
              
              <NavigationMenuLink
                className="group relative p-4 w-full
                         inline-flex justify-center items-center hover:bg-gradient-to-r hover:from-gaming-purple-light/20 hover:to-gaming-cyan-light/20 cursor-pointer transition-all duration-300 hover:text-gaming-text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-destructive-500/20 to-destructive-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-gaming"></div>
                <div className="relative z-10 text-destructive-400 group-hover:text-destructive-300 transition-colors">
                  <UserLogout />
                </div>
                <p className="text-gaming-sm ml-3 relative z-10 font-medium">Logout</p>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
};

export default RightMenu;
