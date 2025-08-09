import React from 'react';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { Anime } from '../types';
import { animes } from '../data/animes';
import Footer from './Footer';
import AdBanner from './AdBanner';

interface CatalogPageProps {
  searchQuery?: string;
  onPlayAnime: (anime: Anime) => void;
  onAnimeDetail: (anime: Anime) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({
  searchQuery = '',
  onPlayAnime,
  onAnimeDetail
}) => {
  const filteredAnimes = animes.filter(anime => {
    const matchesSearch = searchQuery === '' || 
      anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anime.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anime.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Bannière publicitaire en haut */}
        <AdBanner id="homeCatalog" />

        {/* Titre et sous-titre */}
        <div className="mb-12 text-center">
          <h1 className="text-white text-4xl font-bold mb-4">
            {searchQuery ? `Catalogue - Résultats pour "${searchQuery}"` : '📚 Catalogue Complet'}
          </h1>
          <p className="text-gray-400 text-lg">
            {searchQuery
              ? `${filteredAnimes.length} anime${filteredAnimes.length > 1 ? 's' : ''} trouvé${filteredAnimes.length > 1 ? 's' : ''}`
              : 'Découvrez tous nos animes disponibles en streaming'}
          </p>
          {!searchQuery && (
            <div className="mt-4 text-gray-500">
              {filteredAnimes.length} anime{filteredAnimes.length > 1 ? 's' : ''} disponible{filteredAnimes.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Grille d'animes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAnimes.map(anime => (
            <div
              key={anime.id}
              className="group relative bg-gray-900 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer"
              onClick={() => onAnimeDetail(anime)}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayAnime(anime);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-200"
                    >
                      <Play size={20} fill="white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnimeDetail(anime);
                      }}
                      className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-colors duration-200"
                    >
                      <Info size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Badge catégorie */}
                {anime.category && (
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      anime.category === 'nouveaute' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {anime.category === 'nouveaute' ? 'NOUVEAU' : 'CLASSIQUE'}
                    </span>
                  </div>
                )}
                
                {/* Badge type */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    anime.type === 'serie' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-purple-600 text-white'
                  }`}>
                    {anime.type === 'serie' ? 'SÉRIE' : 'FILM'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                  {anime.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{anime.year}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500" fill="currentColor" />
                    <span className="text-yellow-500 font-medium">{anime.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {anime.genre.slice(0, 2).map((g, index) => (
                    <span
                      key={index}
                      className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                
                {anime.type === 'serie' && (
                  <div className="text-xs text-gray-500">
                    {anime.seasons.length} saison{anime.seasons.length > 1 ? 's' : ''} • {' '}
                    {anime.seasons.reduce((total, season) => total + season.episodes.length, 0)} épisodes
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredAnimes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl mb-4">
              {searchQuery ? 'Aucun anime trouvé' : 'Aucun anime disponible'}
            </div>
            <p className="text-gray-500">
              {searchQuery
                ? 'Essayez avec d\'autres mots-clés'
                : 'Revenez bientôt pour découvrir de nouveaux animes !'}
            </p>
          </div>
        )}

        {/* Bannière publicitaire en bas */}
        <div className="mt-12">
          <AdBanner id="homeBottom" />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CatalogPage;