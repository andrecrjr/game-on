import React, { HTMLAttributes, ReactNode } from 'react';

type Props = {
    children: ReactNode
    tag: 'h1'|'h2'|'h3'|'h5'|'h6';
} & HTMLAttributes<HTMLHeadingElement>

const Title = ({children, tag='h2', ...props}: Props) => {
  const DomTag = tag;
  return <DomTag {...props}>{children}</DomTag>;
};

export default Title;