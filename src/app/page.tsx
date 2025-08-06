'use client';

import { useState } from 'react';

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  rating: string;
  genre: Array<{
    id: number;
    name: string;
  }>;
  talent: Array<{
    id: number;
    name: string;
  }>;
  original_language: string;
  similarity_score: number;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`http://localhost:8000/cinematch/recommendations/?query=${encodedQuery}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations`);
      }

      const data = await response.json();
      const moviesArray = data.results || [];
      setMovies(moviesArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-16 pb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-medium text-gray-900 mb-4">
          CinemaMatch
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Get personalized movie recommendations powered by AI
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto px-4 mb-12">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe the movie you're looking for..."
              className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
      </div>

      {/* Results Section */}
      <main className="max-w-4xl mx-auto px-4">

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-600">Searching for recommendations...</p>
          </div>
        )}

        {movies.length > 0 && !loading && (
          <div>
            <h2 className="text-2xl font-medium text-gray-900 mb-8">
              Recommendations ({movies.length})
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {movies.map((movie, index) => (
                <div
                  key={movie.id || index}
                  className="bg-white border border-gray-200 rounded-xl p-0 hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden"
                >
                  {/* Movie Poster - Placeholder since API doesn't provide poster */}
                  <div className="relative bg-gray-100" style={{ aspectRatio: '2/3' }}>
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">🎬</div>
                        <p className="text-xs px-2">
                          {movie.genre.slice(0, 2).map(g => g.name).join(', ')}
                        </p>
                      </div>
                    </div>
                    {/* Rating Badge */}
                    {movie.rating && parseFloat(movie.rating) > 0 && (
                      <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm font-medium">
                        ★ {parseFloat(movie.rating).toFixed(1)}
                      </div>
                    )}
                    {/* Similarity Score Badge */}
                    <div className="absolute top-3 left-3 bg-blue-500 bg-opacity-75 text-white px-2 py-1 rounded-md text-xs font-medium">
                      {Math.round(movie.similarity_score * 100)}% match
                    </div>
                  </div>
                  
                  {/* Movie Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      {movie.release_date && (
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      )}
                      {movie.original_language && (
                        <span className="capitalize">{movie.original_language}</span>
                      )}
                    </div>

                    {/* Genres */}
                    {movie.genre && movie.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {movie.genre.slice(0, 3).map((genre) => (
                          <span
                            key={genre.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {movie.description && (
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {movie.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && movies.length === 0 && query && (
          <div className="text-center py-16">
            <p className="text-gray-600">No recommendations found. Try a different search.</p>
          </div>
        )}

        {!query && !loading && (
          <div className="text-center py-16">
            <p className="text-gray-500">
              Enter a movie description or genre to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
