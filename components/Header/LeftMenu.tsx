import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@radix-ui/react-navigation-menu';
import React from 'react';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';

// import { Container } from './styles';

const LeftMenu: React.FC = () => {
  return <>
   <NavigationMenu className="w-full">
      <NavigationMenuList className="justify-between max-w-full">
          <NavigationMenuItem>
                  <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
        </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu></>;
}

export default LeftMenu;