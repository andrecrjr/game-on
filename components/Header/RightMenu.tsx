import { NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenu } from '@radix-ui/react-navigation-menu';
import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { NavigationMenuContent, NavigationMenuTrigger, navigationMenuTriggerStyle } from '../ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ProfileIcon from '../icons/UserProfile';
import UserLogout from '../icons/UserLogout';



const RightMenu: React.FC = () => {
    const {status, data} = useSession()
    
    if (status === 'authenticated')
    return ( 
        <NavigationMenu className=''>
            <NavigationMenuList className='flex'>
            {/* <NavigationMenuItem>
                    

            </NavigationMenuItem> */}
            <NavigationMenuItem>
                <NavigationMenuTrigger>
                    <Avatar className='w-9 h-9'>
                        <AvatarImage src={data?.user?.steam.avatarmedium} alt={data.user?.username} />
                        <AvatarFallback>AA</AvatarFallback>
                    </Avatar>
                </NavigationMenuTrigger>
                <NavigationMenuContent className='transition fixed flex 
                            bg-black z-10 top-13 flex-col
                                justify-center text-center'>
                    <NavigationMenuLink className='p-4 md:p-2 w-full 
                        inline-flex justify-center items-center hover:opacity-80' 
                                    href="/profile">
                      <ProfileIcon/>  
                      <p className='text-sm md:text-xs ml-1'>Profile</p>
                    </NavigationMenuLink>
                    <NavigationMenuLink className='p-4 md:p-2 w-full
                         inline-flex justify-center 
                         cursor-pointer items-center hover:opacity-80' onClick={(e)=>{
                        e.preventDefault()
                         signOut()
                    }}> 
                     <UserLogout/>   <p className='text-sm md:text-xs ml-1'>Logout</p>
                    </NavigationMenuLink>
                </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
        </NavigationMenu>);
}

export default RightMenu;