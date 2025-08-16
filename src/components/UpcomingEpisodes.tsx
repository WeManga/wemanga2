import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Star, Play } from 'lucide-react';
import { getUpcomingEpisodes, UpcomingEpisode } from '../services/anilistApi';

const UpcomingEpisodes: React.FC = () => {
  const [episodes, setEpisodes] = useState<UpcomingEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUpcomingEpisodes();
        setEpisodes(data);
      } catch (err) {
        setError('Impossible de charger les épisodes à venir');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();

    // Actualiser toutes les 5 minutes
    const interval = setInterval(fetchEpisodes, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeUntil = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatAiringDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section className="mb-16">
        <h2 className="text-white text-3xl font-bold mb-8 text-center">
          Épisodes à venir
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-16">
        <h2 className="text-white text-3xl font-bold mb-8 text-center">
          Épisodes à venir
        </h2>
        <div className="text-center text-gray-400">
          <p>{error}</p>
          <p className="text-sm mt-2">Données temporairement indisponibles</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="text-white text-3xl font-bold mb-8 text-center">
        Épisodes à venir
      </h2>
      <div className="overflow-x-auto scrollbar-hide pb-4">
        <div className="flex gap-6 justify-start px-4 md:px-0 md:justify-center lg:justify-start">
          {episodes.map(episode => (
            <div
              key={episode.id}
              className="group relative bg-gray-900 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer flex-shrink-0 w-64 md:w-72"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={episode.poster}
                  alt={episode.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/*
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-200">
                    <Play size={24} fill="white" />
                  </div>
                </div>
                */}

                {/* Badge épisode */}
                <div className="absolute top-3 left-3">
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ÉP. {episode.nextEpisode}
                  </span>
                </div>

                {/* Temps restant */}
                <div className="absolute top-3 right-3">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{formatTimeUntil(episode.timeUntilAiring)}</span>
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                  {episode.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{formatAiringDate(episode.airingAt)}</span>
                  </div>
                  {episode.rating && (
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-500" fill="currentColor" />
                      <span className="text-yellow-500 font-medium">{episode.rating}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {episode.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEpisodes;
