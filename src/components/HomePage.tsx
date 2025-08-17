// src/components/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Anime, ContinueWatching } from '../types';
import { animes } from '../data/animes';
import { getContinueWatching } from '../utils/cookies';
import Footer from './Footer';
import AdBanner from './AdBanner';
import UpcomingEpisodes from './UpcomingEpisodes';
import { X } from 'lucide-react';

interface HomePageProps {
  filter: 'all' | 'serie' | 'film';
  onPlayAnime: (anime: Anime) => void;
  onAnimeDetail: (anime: Anime) => void;
  searchQuery?: string;
}

// Fonction popunder améliorée
const firePopunder = () => {
  const popUrl = 'https://pl27441070.profitableratecpm.com/f4/39/97/f4399746b6a1899924dab9a65d818df6.html'; // Ta pub

  const popunder = window.open(popUrl, '_blank', 'width=800,height=600,noopener,noreferrer');
  if (popunder) {
    popunder.blur();
    window.focus();
    // Parfois utile pour les navigateurs plus stricts
    setTimeout(() => {
      window.focus();
    }, 500);
  }
};

const HomePage: React.FC<HomePageProps> = ({
  filter,
  onPlayAnime,
  onAnimeDetail,
  searchQuery = ''
}) => {
  const [continueWatchingData, setContinueWatchingData] = useState<ContinueWatching[]>([]);

  useEffect(() => {
    setContinueWatchingData(getContinueWatching());
  }, []);

  const handleRemoveContinueWatching = (animeId: number, seasonId: number, episodeId: number) => {
    const current = getContinueWatching();
    const updated = current.filter(
      item =>
        item.animeId !== animeId ||
        item.seasonId !== seasonId ||
        item.episodeId !== episodeId
    );
    localStorage.setItem("continueWatching", JSON.stringify(updated));
    setContinueWatchingData(updated);
  };

  const filteredAnimes = animes.filter(anime => {
    const matchesFilter = filter === 'all' || anime.type === filter;
    const matchesSearch =
      searchQuery === '' ||
      anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anime.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anime.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const continueWatchingAnimes = continueWatchingData
    .map(item => {
      const anime = animes.find(a => a.id === item.animeId);
      if (!anime) return null;
      const season = anime.seasons.find(s => s.id === item.seasonId);
      if (!season) return null;
      const episode = season.episodes.find(e => e.id === item.episodeId);
      if (!episode) return null;
      return { anime, season, episode, progress: item.progress };
    })
    .filter(Boolean)
    .slice(0, 6);

  const classiques = filteredAnimes.filter(anime => anime.category === 'classique');

  const nouveautes = filteredAnimes
    .map(anime => ({
      anime,
      saisonsNouveaute: anime.seasons.filter(season => season.category === 'nouveaute')
    }))
    .filter(item => item.saisonsNouveaute.length > 0);

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-20">
        {/* HERO */}
        <div className="relative h-[70vh] overflow-hidden">
          <img
            src="/chatgpt-image.png.png"
            alt="WeManga - Anime Heroes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-white text-5xl md:text-7xl font-bold mb-4">WeManga</h1>
              <p className="text-gray-300 text-xl md:text-2xl mb-8">
                Découvrez les meilleurs animes en streaming VF
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* RECHERCHE */}
          {searchQuery && (
            <section className="mb-16">
              <h2 className="text-white text-3xl font-bold mb-8 text-center">
                🔍 Résultats pour "{searchQuery}"
              </h2>
              {filteredAnimes.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredAnimes.map(anime => (
                    <div
                      key={anime.id}
                      onClick={() => {
                        firePopunder();
                        onAnimeDetail(anime);
                      }}
                      className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                    >
                      <img src={anime.poster} alt={anime.title} className="w-full h-64 object-cover" />
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-white">{anime.title}</h3>
                        <p className="text-gray-400 text-sm">{anime.year} • {anime.genre.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">Aucun résultat trouvé</div>
              )}
            </section>
          )}
          {/* CONTINUE WATCHING */}
          {!searchQuery && continueWatchingAnimes.length > 0 && (
            <section className="mb-16">
              <h2 className="text-white text-3xl font-bold mb-8 text-center">
                Reprenez votre visionnage
              </h2>
              <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                {continueWatchingAnimes.map(({ anime, season, episode, progress }, idx) => (
                  <div
                    key={`cw-${idx}`}
                    className="bg-gray-900 rounded-xl overflow-hidden flex-shrink-0 w-56 hover:scale-105 transition-transform relative"
                    onClick={() => { firePopunder(); onAnimeDetail(anime); }}
                  >
                    {/* BOUTON CROIX */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveContinueWatching(anime.id, season.id, episode.id);
                      }}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 z-10"
                      title="Retirer de la liste"
                    >
                      <X size={14} />
                    </button>
                    <div>
                      <div className="relative aspect-[3/4]">
                        <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                          <div
                            className="h-full bg-red-600"
                            style={{ width: `${(progress ?? 0) * 100}%` }}
                          />
                        </div>
                        <div className="absolute top-2 left-2 bg-orange-600 px-2 py-1 rounded text-xs font-bold">
                          {season.title} - {episode.title}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-bold truncate">{anime.title}</h3>
                        <p className="text-xs text-gray-400 truncate">{episode.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* BANDEAU PUB haut */}
          <AdBanner id="homeTop" />
          {/* EPISODES À VENIR */}
          {!searchQuery && <UpcomingEpisodes />}
          {/* NOUVEAUTÉS */}
          {!searchQuery && nouveautes.length > 0 && (
            <section className="mb-16">
              <h2 className="text-white text-3xl font-bold mb-8 text-center">Nouveautés</h2>
              <div
                className="
                  flex gap-4 overflow-x-auto 
                  md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                  md:gap-8
                  scrollbar-hide
                "
              >
                {nouveautes.map(({ anime, saisonsNouveaute }) =>
                  saisonsNouveaute.map(season => (
                    <div
                      key={`${anime.id}-season-${season.number}`}
                      onClick={() => {
                        firePopunder();
                        onAnimeDetail(anime);
                      }}
                      className="bg-gray-900 w-48 md:w-auto flex-shrink-0 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                    >
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-white">{anime.title}</h3>
                        <p className="text-gray-400 text-sm">{season.title}</p>
                        <p className="text-gray-400 text-sm">{anime.genre.join(', ')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
          {/* PUB */}
          <AdBanner id="homeClassics" />
          {/* CLASSIQUES */}
          {!searchQuery && classiques.length > 0 && (
            <section className="mb-16">
              <h2 className="text-white text-3xl font-bold mb-8 text-center">Les Classiques</h2>
              <div
                className="
                  flex gap-4 overflow-x-auto
                  md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                  md:gap-8
                  scrollbar-hide
                "
              >
                {classiques.map(anime => (
                  <div
                    key={anime.id}
                    onClick={() => {
                      firePopunder();
                      onAnimeDetail(anime);
                    }}
                    className="bg-gray-900 w-48 md:w-auto flex-shrink-0 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                  >
                    <img
                      src={anime.poster}
                      alt={anime.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white">{anime.title}</h3>
                      <p className="text-gray-400 text-sm">{anime.genre.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <AdBanner id="homeBottom" />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
