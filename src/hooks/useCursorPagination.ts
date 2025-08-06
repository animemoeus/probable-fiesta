'use client';

import { useState, useCallback } from 'react';

interface CursorPaginationState<T> {
  items: T[];
  nextUrl: string | null;
  previousUrl: string | null;
  loading: boolean;
  error: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CursorPaginationActions<T> {
  loadNext: () => Promise<void>;
  loadPrevious: () => Promise<void>;
  reset: () => void;
  setData: (data: { next: string | null; previous: string | null; results: T[] }) => void;
}

export function useCursorPagination<T>(): CursorPaginationState<T> & CursorPaginationActions<T> {
  const [items, setItems] = useState<T[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPage = useCallback(async (url: string) => {
    if (!url || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch page');
      }

      const data = await response.json();
      setItems(data.results || []);
      setNextUrl(data.next);
      setPreviousUrl(data.previous);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setItems([]);
      setNextUrl(null);
      setPreviousUrl(null);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const loadNext = useCallback(async () => {
    if (nextUrl) {
      await fetchPage(nextUrl);
    }
  }, [nextUrl, fetchPage]);

  const loadPrevious = useCallback(async () => {
    if (previousUrl) {
      await fetchPage(previousUrl);
    }
  }, [previousUrl, fetchPage]);

  const reset = useCallback(() => {
    setItems([]);
    setNextUrl(null);
    setPreviousUrl(null);
    setError('');
    setLoading(false);
  }, []);

  const setData = useCallback((data: { next: string | null; previous: string | null; results: T[] }) => {
    setItems(data.results || []);
    setNextUrl(data.next);
    setPreviousUrl(data.previous);
    setError('');
  }, []);

  return {
    items,
    nextUrl,
    previousUrl,
    loading,
    error,
    hasNextPage: !!nextUrl,
    hasPrevPage: !!previousUrl,
    loadNext,
    loadPrevious,
    reset,
    setData,
  };
}