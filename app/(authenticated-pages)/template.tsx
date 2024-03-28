import { TemplateProps } from "@/app/template";

import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Grid from "@/components/Grid";
import Column from "@/components/Grid/Column";
import ColumnProfile from "@/components/Profile";
import { Header } from "@/components/Header";
import { getAuthOptions } from "../api/auth/[...nextauth]/route";



export default async function Template({children}:TemplateProps) {
  
  return (
  <>
      <main className="pt-10 mx-auto w-full">
          <Grid className='flex-col-reverse md:divide-x-2 md:divide-gray-200 relative'>
                <Column className='md:w-9/12'>
                    {children}
                </Column>
                <ColumnProfile/>
            </Grid>
        </main>
    </>);
}
