// src/utils/cookies.ts

export interface ContinueWatching {
  animeId: number;
  seasonId: number;
  episodeId: number;
  animeTitle: string;
  episodeTitle: string;
  progress: number; // valeur entre 0 et 1
  timestamp: number;
}

const CONTINUE_WATCHING_KEY = 'continueWatching';

/**
 * Sauvegarde une entrée "reprendre le visionnage" dans le localStorage.
 * Évite les doublons via animeId/seasonId/episodeId.
 */
export const saveContinueWatching = (data: ContinueWatching): void => {
  try {
    const existingData = getContinueWatching();

    // ✅ Retire toute entrée de ce même épisode
    const updatedData = existingData.filter(item =>
      !(item.animeId === data.animeId &&
        item.seasonId === data.seasonId &&
        item.episodeId === data.episodeId)
    );

    // Place en tête
    updatedData.unshift(data);

    // Limite à 10 éléments
    localStorage.setItem(
      CONTINUE_WATCHING_KEY,
      JSON.stringify(updatedData.slice(0, 10))
    );
  } catch (error) {
    console.error('Error saving continue watching data:', error);
  }
};

/**
 * Récupère toutes les entrées "reprendre le visionnage".
 */
export const getContinueWatching = (): ContinueWatching[] => {
  try {
    const data = localStorage.getItem(CONTINUE_WATCHING_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting continue watching data:', error);
    return [];
  }
};

/**
 * Supprime une entrée spécifique en fonction de ses IDs.
 */
export const removeContinueWatching = (
  animeId: number,
  seasonId: number,
  episodeId: number
): void => {
  try {
    const existingData = getContinueWatching();

    const filteredData = existingData.filter(item =>
      !(item.animeId === animeId &&
        item.seasonId === seasonId &&
        item.episodeId === episodeId)
    );

    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(filteredData));
  } catch (error) {
    console.error('Error removing continue watching data:', error);
  }
};
