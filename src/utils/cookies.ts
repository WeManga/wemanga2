// utils/cookies.ts
export interface ContinueWatching {
  animeTitle: string;
  episodeTitle: string;
  progress: number;
  timestamp: number;
}

const CONTINUE_WATCHING_KEY = 'continueWatching';

export const saveContinueWatching = (data: ContinueWatching): void => {
  try {
    const existingData = getContinueWatching();

    // ✅ Comparaison stricte avec ===
    const updatedData = existingData.filter(item => 
      !(item.animeTitle === data.animeTitle && item.episodeTitle === data.episodeTitle)
    );

    updatedData.unshift(data);
    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updatedData.slice(0, 10)));
  } catch (error) {
    console.error('Error saving continue watching data:', error);
  }
};

export const getContinueWatching = (): ContinueWatching[] => {
  try {
    const data = localStorage.getItem(CONTINUE_WATCHING_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting continue watching data:', error);
    return [];
  }
};

export const removeContinueWatching = (animeTitle: string, episodeTitle: string): void => {
  try {
    const existingData = getContinueWatching();

    // ✅ Comparaison stricte
    const filteredData = existingData.filter(item => 
      !(item.animeTitle === animeTitle && item.episodeTitle === episodeTitle)
    );

    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(filteredData));
  } catch (error) {
    console.error('Error removing continue watching data:', error);
  }
};
