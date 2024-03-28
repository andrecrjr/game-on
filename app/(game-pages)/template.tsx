import { TemplateProps } from "@/app/template";

import React from "react";
import Grid from "@/components/Grid";




export default async function Template({children}:TemplateProps) {
  
  return (
  <>
      <main className="pt-10 mx-auto w-full">
          <Grid className='flex-col-reverse md:divide-x-2 md:divide-gray-200 relative'>
                    {children}
            </Grid>
        </main>
    </>);
}
