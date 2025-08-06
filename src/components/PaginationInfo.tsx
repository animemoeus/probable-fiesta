'use client';

interface PaginationInfoProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  className?: string;
  variant?: 'modern' | 'retro';
}

export default function PaginationInfo({
  currentPage,
  itemsPerPage,
  totalItems,
  className = '',
  variant = 'modern'
}: PaginationInfoProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const baseClasses = variant === 'modern' 
    ? 'text-gray-600 text-sm'
    : 'text-black font-mono font-bold uppercase';

  return (
    <div className={`${baseClasses} ${className}`}>
      {variant === 'modern' ? (
        `Showing ${startItem}-${endItem} of ${totalItems} results`
      ) : (
        `SHOWING ${startItem}-${endItem} OF ${totalItems} RESULTS`
      )}
    </div>
  );
}