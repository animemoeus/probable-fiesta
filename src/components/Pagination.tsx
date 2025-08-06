'use client';

interface CursorPaginationProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  loading?: boolean;
  className?: string;
  variant?: 'modern' | 'retro';
}

export default function Pagination({ 
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  loading = false,
  className = '',
  variant = 'modern' 
}: CursorPaginationProps) {
  const baseClasses = variant === 'modern' 
    ? 'flex items-center gap-4'
    : 'flex items-center gap-0 font-mono';

  const buttonClasses = variant === 'modern'
    ? 'px-4 py-2 rounded-md border transition-colors'
    : 'px-6 py-3 border-4 border-black font-bold uppercase transition-colors';

  const enabledClasses = variant === 'modern'
    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    : 'bg-white text-black border-black hover:bg-yellow-300';

  const disabledClasses = variant === 'modern'
    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
    : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed';

  const loadingClasses = variant === 'modern'
    ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-wait'
    : 'bg-gray-200 text-gray-600 border-gray-400 cursor-wait';

  const getButtonClass = (isEnabled: boolean) => {
    if (loading) return `${buttonClasses} ${loadingClasses}`;
    return `${buttonClasses} ${isEnabled ? enabledClasses : disabledClasses}`;
  };

  return (
    <div className={`${baseClasses} ${className}`}>
      <button
        onClick={onPrevPage}
        disabled={!hasPrevPage || loading}
        className={getButtonClass(hasPrevPage)}
      >
        {variant === 'modern' ? '← Previous' : '← PREV'}
      </button>

      <button
        onClick={onNextPage}
        disabled={!hasNextPage || loading}
        className={getButtonClass(hasNextPage)}
      >
        {variant === 'modern' ? 'Next →' : 'NEXT →'}
      </button>
    </div>
  );
}