import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ScrollingMessage from './components/ScrollingMessage';
import HomePage from './components/HomePage';
import AnimeDetail from './components/AnimeDetail';
import VideoPlayer from './components/VideoPlayer';
import SeriesPage from './components/SeriesPage';
import FilmsPage from './components/FilmsPage';
import CatalogPage from './components/CatalogPage';
import { Anime, Episode, Season } from './types';
import { saveContinueWatching } from './utils/cookies';

type AppState = 'home' | 'series' | 'films' | 'catalog' | 'detail' | 'player';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [filter, setFilter] = useState<'all' | 'serie' | 'film' | 'catalog'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /** Navigation */
  const handleHomeClick = () => {
    setCurrentState('home');
    setFilter('all');
    setSearchQuery('');
    setSelectedAnime(null);
    setSelectedEpisode(null);
    setSelectedSeason(null);
    scrollToTop();
  };

  const handleFilterChange = (newFilter: 'all' | 'serie' | 'film' | 'catalog') => {
    setFilter(newFilter);
    setSearchQuery('');
    setCurrentState(
      newFilter === 'serie'
        ? 'series'
        : newFilter === 'film'
        ? 'films'
        : newFilter === 'catalog'
        ? 'catalog'
        : 'home'
    );
    scrollToTop();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentState('home');
    scrollToTop();
  };

  /** Lecture */
  const handlePlayAnime = (anime: Anime) => {
  const firstSeason = anime.seasons[0];
  const firstEpisode = firstSeason.episodes; // 😊 CORRECT !
  setSelectedAnime(anime);
  setSelectedSeason(firstSeason);
  setSelectedEpisode(firstEpisode);
  setCurrentState('player');
  scrollToTop();
};


  const handleAnimeDetail = (anime: Anime) => {
    setSelectedAnime(anime);
    setCurrentState('detail');
    scrollToTop();
  };

  const handlePlayEpisode = (anime: Anime, season: Season, episode: Episode) => {
    setSelectedEpisode(episode);
    setSelectedSeason(season);
    setSelectedAnime(anime);
    setCurrentState('player');
    scrollToTop();
  };

  const handleBack = () => {
    setCurrentState(currentState === 'player' ? 'detail' : 'home');
    scrollToTop();
  };

  /** Épisodes suivants / précédents */
  const handleNextEpisode = () => {
    if (!selectedEpisode || !selectedSeason) return;
    const index = selectedSeason.episodes.findIndex(ep => ep.id === selectedEpisode.id);
    if (index < selectedSeason.episodes.length - 1) {
      setSelectedEpisode(selectedSeason.episodes[index + 1]);
    }
  };

  const handlePreviousEpisode = () => {
    if (!selectedEpisode || !selectedSeason) return;
    const index = selectedSeason.episodes.findIndex(ep => ep.id === selectedEpisode.id);
    if (index > 0) {
      setSelectedEpisode(selectedSeason.episodes[index - 1]);
    }
  };

  /** Sauvegarde progression */
  const handleProgress = (progress: number) => {
    if (selectedAnime && selectedSeason && selectedEpisode) {
      if (progress > 0.01) {
        saveContinueWatching({
          animeId: selectedAnime.id,
          seasonId: selectedSeason.id,
          episodeId: selectedEpisode.id,
          animeTitle: selectedAnime.title,
          episodeTitle: selectedEpisode.title,
          progress,
          timestamp: Date.now(),
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {currentState !== 'player' && (
        <>
          <ScrollingMessage />
          <Navbar
            activeFilter={filter}
            onFilterChange={handleFilterChange}
            onHomeClick={handleHomeClick}
            onSearch={handleSearch}
          />
        </>
      )}
      {/* Pages */}
      {currentState === 'home' && (
        <HomePage
          filter={filter}
          searchQuery={searchQuery}
          onPlayAnime={handlePlayAnime}
          onAnimeDetail={handleAnimeDetail}
          onPlayEpisode={handlePlayEpisode}
        />
      )}
      {currentState === 'series' && (
        <SeriesPage
          searchQuery={searchQuery}
          onPlayAnime={handlePlayAnime}
          onAnimeDetail={handleAnimeDetail}
        />
      )}
      {currentState === 'films' && (
        <FilmsPage
          searchQuery={searchQuery}
          onPlayAnime={handlePlayAnime}
          onAnimeDetail={handleAnimeDetail}
        />
      )}
      {currentState === 'catalog' && (
        <CatalogPage
          searchQuery={searchQuery}
          onPlayAnime={handlePlayAnime}
          onAnimeDetail={handleAnimeDetail}
        />
      )}
      {currentState === 'detail' && selectedAnime && (
        <AnimeDetail
          anime={selectedAnime}
          onBack={handleBack}
          onPlayEpisode={handlePlayEpisode}
        />
      )}
      {currentState === 'player' && selectedEpisode && selectedSeason && selectedAnime && (
        <VideoPlayer
          animeId={selectedAnime.id}
          animeTitle={selectedAnime.title}
          episode={selectedEpisode}
          season={selectedSeason}
          onBack={handleBack}
          onNextEpisode={handleNextEpisode}
          onPreviousEpisode={handlePreviousEpisode}
          hasNextEpisode={
            selectedSeason.episodes.findIndex(ep => ep.id === selectedEpisode.id) <
            selectedSeason.episodes.length - 1
          }
          hasPreviousEpisode={
            selectedSeason.episodes.findIndex(ep => ep.id === selectedEpisode.id) > 0
          }
          onProgress={handleProgress}
        />
      )}
    </div>
  );
}

export default App;
