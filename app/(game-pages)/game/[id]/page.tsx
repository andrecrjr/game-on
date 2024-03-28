import React from "react";

type Props = {
  params: {id:string}
};

const Page = (props:Props) => {
  
  return <p>{props.params.id}</p>;
};

export default Page