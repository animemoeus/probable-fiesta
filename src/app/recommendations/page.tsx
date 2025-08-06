'use client';

import { useState } from 'react';
import Image from 'next/image';
import Pagination from '@/components/Pagination';
import { useCursorPagination } from '@/hooks/useCursorPagination';

interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path?: string;
}

export default function RecommendationsPage() {
  const [query, setQuery] = useState('');

  const pagination = useCursorPagination<Movie>();
  const { items: movies, loading, error } = pagination;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    pagination.reset();

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`http://localhost:8000/cinematch/recommendations/?query=${encodedQuery}&count=12`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      pagination.setData(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black bg-black text-white p-6">
        <h1 className="text-4xl font-bold uppercase tracking-wider">CINEMATCH</h1>
        <p className="text-lg mt-2 font-bold">MOVIE RECOMMENDATION ENGINE</p>
      </header>

      {/* Search Section */}
      <section className="p-6 bg-gray-100 border-b-4 border-black">
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <label htmlFor="query" className="block text-2xl font-bold uppercase mb-4 tracking-wide">
            ENTER MOVIE QUERY:
          </label>
          <div className="flex gap-0">
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="romantic comedy movies, action thriller, etc..."
              className="flex-1 p-4 text-xl border-4 border-black bg-white font-mono focus:outline-none focus:bg-yellow-300 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-4 bg-black text-white text-xl font-bold uppercase border-4 border-black hover:bg-red-600 hover:border-red-600 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'LOADING...' : 'SEARCH'}
            </button>
          </div>
        </form>
      </section>

      {/* Results Section */}
      <main className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500 text-white border-4 border-black">
            <h2 className="text-xl font-bold uppercase">ERROR:</h2>
            <p className="text-lg">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-yellow-300 border-4 border-black">
              <p className="text-2xl font-bold uppercase">LOADING RECOMMENDATIONS...</p>
            </div>
          </div>
        )}

        {movies.length > 0 && !loading && (
          <div>
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
              <h2 className="text-3xl font-bold uppercase">
                RECOMMENDATIONS ({movies.length})
              </h2>
            </div>
            <div className="grid gap-6">
              {movies.map((movie, index) => (
                <div
                  key={movie.id || index}
                  className="bg-white border-4 border-black p-6 hover:bg-yellow-300 transition-colors"
                >
                  <div className="flex gap-6">
                    {movie.poster_path && (
                      <div className="w-24 h-36 bg-gray-300 border-2 border-black flex-shrink-0">
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                          width={96}
                          height={144}
                          className="w-full h-full object-cover border-2 border-black"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold uppercase mb-2">{movie.title}</h3>
                      {movie.release_date && (
                        <p className="text-lg font-bold mb-2">YEAR: {new Date(movie.release_date).getFullYear()}</p>
                      )}
                      {movie.vote_average && (
                        <p className="text-lg font-bold mb-2">RATING: {movie.vote_average.toFixed(1)}/10</p>
                      )}
                      {movie.overview && (
                        <p className="text-base leading-relaxed">{movie.overview}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {(pagination.hasNextPage || pagination.hasPrevPage) && (
              <div className="flex justify-center mt-8 mb-8">
                <Pagination
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  onNextPage={pagination.loadNext}
                  onPrevPage={pagination.loadPrevious}
                  loading={loading}
                  variant="retro"
                />
              </div>
            )}
          </div>
        )}

        {!loading && !error && movies.length === 0 && query && (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-red-500 text-white border-4 border-black">
              <p className="text-2xl font-bold uppercase">NO RECOMMENDATIONS FOUND</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}