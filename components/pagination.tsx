import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string>;
};

const Pagination = ({
  baseUrl,
  searchParams,
  currentPage,
  totalPages,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams({
      ...searchParams,
      page: page.toString(),
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <nav className="flex justify-center items-center gap-1">
      <Link
        href={getPageUrl(currentPage - 1)}
        className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 ${
          currentPage === 1 ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        <ChevronLeft />
      </Link>

      {getVisiblePages().map((page, index) => {
        if (page === '...') {
          return (
            <span key={index} className="px-4 py-2 text-gray-700">
              ...
            </span>
          );
        }
        const pageNumber = page as number;
        const isCurrentPage = pageNumber === currentPage;

        return (
          <Link
            key={index}
            href={getPageUrl(pageNumber)}
            className={`px-4 py-2 rounded-lg hover:bg-gray-300 ${
              isCurrentPage
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      <Link
        href={getPageUrl(currentPage + 1)}
        className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 ${
          currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        <ChevronRight />
      </Link>
    </nav>
  );
};

export default Pagination;
