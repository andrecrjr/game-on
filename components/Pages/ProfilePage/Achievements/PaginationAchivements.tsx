import React from 'react';

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

type Props = {
	id: string;
	totalPages: number;
};

export const PaginationAchivements = ({ id, totalPages }: Props) => {
	const currentPage = parseInt(id);
	return (
		<Pagination>
			<PaginationContent>
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious
							href={`/profile/achievements/${currentPage - 1}`}
						/>
					</PaginationItem>
				)}
				{currentPage > 2 && (
					<PaginationItem>
						<PaginationLink href={`/profile/achievements/${currentPage - 2}`}>
							{currentPage - 2}
						</PaginationLink>
					</PaginationItem>
				)}
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationLink href={`/profile/achievements/${currentPage - 1}`}>
							{currentPage - 1}
						</PaginationLink>
					</PaginationItem>
				)}
				<PaginationItem>
					<PaginationLink
						href={`/profile/achievements/${currentPage}`}
						isActive
					>
						{currentPage}
					</PaginationLink>
				</PaginationItem>
				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationLink href={`/profile/achievements/${currentPage + 1}`}>
							{currentPage + 1}
						</PaginationLink>
					</PaginationItem>
				)}
				{currentPage < totalPages - 1 && (
					<PaginationItem>
						<PaginationLink href={`/profile/achievements/${currentPage + 2}`}>
							{currentPage + 2}
						</PaginationLink>
					</PaginationItem>
				)}
				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationNext href={`/profile/achievements/${currentPage + 1}`} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
};
