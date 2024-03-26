import { TemplateProps } from "@/app/template";

import React from "react";
import { getAuthOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";



export default async function Template({children}:TemplateProps) {
  
  const session = await getServerSession(getAuthOptions(undefined))
  
   if(!session){
    redirect("/")
  }

  return (<main className="pt-10 mx-auto">
      {children}
    </main>);
}
