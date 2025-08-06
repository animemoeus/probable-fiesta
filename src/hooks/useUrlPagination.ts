'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { usePagination } from './usePagination';

interface UseUrlPaginationProps {
  itemsPerPage: number;
  defaultPage?: number;
}

export function useUrlPagination({ itemsPerPage, defaultPage = 1 }: UseUrlPaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentPageFromUrl = parseInt(searchParams.get('page') || defaultPage.toString(), 10);
  const validPage = Math.max(1, currentPageFromUrl);
  
  const pagination = usePagination({ 
    itemsPerPage, 
    initialPage: validPage 
  });

  const updateUrlPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(newUrl, { scroll: false });
  }, [searchParams, router, pathname]);

  const goToPageWithUrl = useCallback((page: number) => {
    pagination.goToPage(page);
    updateUrlPage(page);
  }, [pagination, updateUrlPage]);

  useEffect(() => {
    if (validPage !== pagination.currentPage) {
      pagination.goToPage(validPage);
    }
  }, [validPage]);

  return {
    ...pagination,
    goToPage: goToPageWithUrl,
    goToNextPage: () => goToPageWithUrl(pagination.currentPage + 1),
    goToPrevPage: () => goToPageWithUrl(pagination.currentPage - 1),
    goToFirstPage: () => goToPageWithUrl(1),
    goToLastPage: () => goToPageWithUrl(pagination.totalPages),
  };
}