import classNames from 'classnames';
import React from 'react';

interface IColumn extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Column: React.FC<IColumn> = ({ children, className, ...rest }) => {
  const columnStyle = classNames('w-auto', className);
  return (
    <section className={columnStyle} {...rest}>
      {children}
    </section>
  );
};

export default Column;
