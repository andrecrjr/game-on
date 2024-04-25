import { TemplateProps } from "@/app/template";

import React from "react";
import Grid from "@/components/Grid";
import Column from "@/components/Grid/Column";




export default async function Template({children}:TemplateProps) {
  return (
      <main className="pt-10 mx-auto w-full px-4 md:px-0">
          <Grid className='flex-col-reverse relative'>
                    {children}
            </Grid>
        </main>
   );
}
