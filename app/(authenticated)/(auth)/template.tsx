import { TemplateProps } from "@/app/template";
import React from "react";



export default function Template({children}:TemplateProps) {
  return (<main>
      <section className="mt-16 flex items-center justify-center">{children}</section>
    </main>);
}
