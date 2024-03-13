import { TemplateProps } from "@/app/template";
import React from "react";



export default function Template({children}:TemplateProps) {
  return (<main className="pt-10 flex items-center justify-center flex-wrap">
      {children}
    </main>);
}
