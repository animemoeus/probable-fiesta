'use client';

import { useState, useMemo, useCallback } from 'react';

interface UsePaginationProps {
  itemsPerPage: number;
  initialPage?: number;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

interface PaginationActions {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setTotalItems: (total: number) => void;
  paginateItems: <T>(items: T[]) => T[];
}

export function usePagination({ 
  itemsPerPage, 
  initialPage = 1 
}: UsePaginationProps): PaginationState & PaginationActions {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalItems, setTotalItemsState] = useState(0);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const safePage = Math.max(1, Math.min(currentPage, totalPages));
    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return {
      currentPage: safePage,
      itemsPerPage,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
    };
  }, [currentPage, itemsPerPage, totalItems]);

  const goToPage = useCallback((page: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const safePage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(safePage);
  }, [totalItems, itemsPerPage]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPrevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    goToPage(totalPages);
  }, [totalItems, itemsPerPage, goToPage]);

  const setTotalItems = useCallback((total: number) => {
    setTotalItemsState(total);
    const totalPages = Math.ceil(total / itemsPerPage) || 1;
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, itemsPerPage]);

  const paginateItems = useCallback(<T,>(items: T[]): T[] => {
    const { startIndex, endIndex } = paginationData;
    return items.slice(startIndex, endIndex);
  }, [paginationData]);

  return {
    ...paginationData,
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    setTotalItems,
    paginateItems,
  };
}