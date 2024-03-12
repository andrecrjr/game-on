import { NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenu } from '@radix-ui/react-navigation-menu';
import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { NavigationMenuContent, NavigationMenuTrigger, navigationMenuTriggerStyle } from '../ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';



const RightMenu: React.FC = () => {
    const {status, data} = useSession()
    
    if (status === 'authenticated')
    return ( 
        <NavigationMenu className='mr-5'>
            <NavigationMenuList className='flex'>
            <NavigationMenuItem>
                    

            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger>
                    <Avatar className='w-9 h-9'>
                        <AvatarImage src={data?.user?.steam.avatarmedium} alt={data.user?.username} />
                        <AvatarFallback>AA</AvatarFallback>
                    </Avatar>
                </NavigationMenuTrigger>
                <NavigationMenuContent className='transition fixed flex bg-black z-10 top-13 left-0 flex-col text-center'>
                    <NavigationMenuLink className='p-4 text-sm' href="/profile">
                        Profile
                    </NavigationMenuLink>
                    <NavigationMenuLink className='p-4 cursor-pointer' onClick={(e)=>{
                        e.preventDefault()
                         signOut()
                    }}> 
                        Logout
                    </NavigationMenuLink>
                </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
        </NavigationMenu>);
}

export default RightMenu;