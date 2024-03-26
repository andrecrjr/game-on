import { TemplateProps } from "@/app/template";

import React from "react";
import { getAuthOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Grid from "@/components/Grid";
import Column from "@/components/Grid/Column";
import ColumnProfile from "@/components/Profile";



export default async function Template({children}:TemplateProps) {
  
  const session = await getServerSession(getAuthOptions(undefined))
  
   if(!session){
    redirect("/")
  }

  return (<main className="pt-10 mx-auto w-full">
      <Grid className='flex-col-reverse md:divide-x-2 md:divide-gray-200 relative'>
            <Column className='md:w-9/12'>
                 {children}
            </Column>
            <ColumnProfile/>
        </Grid>
    </main>);
}
