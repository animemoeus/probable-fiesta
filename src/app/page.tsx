'use client';

import { useState, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import ChatGPTSearchInput from '@/components/ChatGPTSearchInput';
import { useCursorPagination } from '@/hooks/useCursorPagination';

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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pagination = useCursorPagination<Movie>();
  const { items: movies, loading, error } = pagination;

  const mapSimilarityToPercentage = (similarityScore: number) => {
    const maxRealisticScore = 0.5;
    const percentage = Math.min(100, Math.max(0, (similarityScore / maxRealisticScore) * 100));
    return Math.round(percentage);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleSubmit = async (query: string) => {
    if (!query.trim()) return;

    pagination.reset();

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`https://api.animemoe.us/cinematch/recommendations/?query=${encodedQuery}&count=12`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations`);
      }

      const data = await response.json();
      pagination.setData(data);
    } catch (err) {
      console.error('Search error:', err);
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
        <div className="px-4 mb-12">
          <ChatGPTSearchInput
            onSubmit={handleSubmit}
            loading={loading}
            placeholder="Describe the movie you're looking for..."
          />
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
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-gray-900">
                Recommendations
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {movies.map((movie, index) => (
                <div
                  key={movie.id || index}
                  onClick={() => openModal(movie)}
                  className="bg-white border border-gray-200 rounded-xl p-0 hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden cursor-pointer"
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
                      {mapSimilarityToPercentage(movie.similarity_score)}% match
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
            
            {(pagination.hasNextPage || pagination.hasPrevPage) && (
              <div className="flex justify-center mt-12 mb-12">
                <Pagination
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  onNextPage={pagination.loadNext}
                  onPrevPage={pagination.loadPrevious}
                  loading={loading}
                  variant="modern"
                />
              </div>
            )}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">
              Enter a movie description or genre to get started
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && selectedMovie && (
        <div 
          className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900 pr-4">
                  {selectedMovie.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Movie Poster and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div 
                    className="bg-gray-100 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300"
                    style={{ width: '200px', aspectRatio: '2/3' }}
                  >
                    <div className="text-center text-gray-500">
                      <div className="text-6xl mb-2">🎬</div>
                      <p className="text-sm px-2">
                        {selectedMovie.genre.slice(0, 2).map(g => g.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selectedMovie.release_date && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Release Date</h4>
                        <p className="text-gray-700">{new Date(selectedMovie.release_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedMovie.rating && parseFloat(selectedMovie.rating) > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Rating</h4>
                        <p className="text-gray-700">★ {parseFloat(selectedMovie.rating).toFixed(1)}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Language</h4>
                      <p className="text-gray-700 capitalize">{selectedMovie.original_language}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Match Score</h4>
                      <p className="text-gray-700">{mapSimilarityToPercentage(selectedMovie.similarity_score)}%</p>
                    </div>
                  </div>

                  {/* Genres */}
                  {selectedMovie.genre && selectedMovie.genre.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Genres</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.genre.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cast */}
                  {selectedMovie.talent && selectedMovie.talent.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Cast</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.talent.map((person) => (
                          <span
                            key={person.id}
                            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-md"
                          >
                            {person.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedMovie.description && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedMovie.description}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Movie ID:</span>
                    <span className="ml-2 text-gray-700">{selectedMovie.id}</span>
                  </div>
                  {selectedMovie.created_at && (
                    <div>
                      <span className="font-medium text-gray-600">Added:</span>
                      <span className="ml-2 text-gray-700">{new Date(selectedMovie.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedMovie.updated_at && (
                    <div>
                      <span className="font-medium text-gray-600">Updated:</span>
                      <span className="ml-2 text-gray-700">{new Date(selectedMovie.updated_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
