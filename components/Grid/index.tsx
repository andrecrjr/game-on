import React, { Children } from 'react';
import classNames from 'classnames';
// import { Container } from './styles';

interface IGrid extends React.HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
}

const Grid: React.FC<IGrid> = ({ children, className, ...rest }) => {
	const gridStyles = classNames(
		`mx-auto md:flex-row md:max-w-screen-md 
    lg:max-w-screen-lg flex flex-wrap`,
		className,
	);
	return (
		<section className={gridStyles} {...rest}>
			{children}
		</section>
	);
};

export default Grid;
