'use client';

import { useState, FormEvent } from 'react';

interface ChatGPTSearchInputProps {
  onSubmit: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function ChatGPTSearchInput({ 
  onSubmit, 
  loading = false, 
  placeholder = "Describe the movie you're looking for..." 
}: ChatGPTSearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    onSubmit(query);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            rows={1}
            className="w-full px-6 py-4 pr-14 bg-transparent border-0 rounded-full resize-none outline-none placeholder-gray-500 text-gray-900 text-base leading-relaxed overflow-hidden"
            style={{ 
              minHeight: '56px',
              maxHeight: '200px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 200) + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            )}
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2 px-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{query.length}/500</span>
        </div>
      </form>
    </div>
  );
}