import HeroBanner from "@/components/Herobanner";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "./(authenticated)/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { HeaderNotLogged } from "@/components/Header";

export default async function Home() {
  const session = await getServerSession(getAuthOptions(undefined))

  if(!!session){
    redirect("/profile")
  }
  
  return (
      <>
      <HeaderNotLogged />
      <main 
        className="flex flex-col items-center justify-between md:p-14">
        <HeroBanner />
      </main>
    </>
  );
}
