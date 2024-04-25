import Column from "@/components/Grid/Column";
import AsideGameGenericPage from "@/components/Pages/GamePage/AsideGameGenericPage";
import React from "react";

type Props = {
  params: {id:string}
};

const GamePage = async (props:Props) => {
  
  return (
    <>
    <Column className='md:w-9/12'>
           <h2>Game Feed</h2>
    </Column>
     <Column className='md:w-3/12'>
           <AsideGameGenericPage {...props}/>
    </Column>
    </>
    )
};

export default GamePage