interface AniListAnime {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  bannerImage?: string;
  description?: string;
  genres: string[];
  averageScore?: number;
  startDate: {
    year?: number;
    month?: number;
    day?: number;
  };
  status: string;
  episodes?: number;
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
}

interface AniListResponse {
  data: {
    Page: {
      media: AniListAnime[];
    };
  };
}

export interface UpcomingEpisode {
  id: number;
  title: string;
  poster: string;
  banner?: string;
  nextEpisode: number;
  airingAt: number;
  timeUntilAiring: number;
  description?: string;
  genres: string[];
  rating?: number;
}

const ANILIST_API_URL = 'https://graphql.anilist.co';

const UPCOMING_EPISODES_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: ANIME,
        status: RELEASING,
        sort: [POPULARITY_DESC],
        isAdult: false
      ) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        genres
        averageScore
        startDate {
          year
          month
          day
        }
        status
        episodes
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`;

export const getUpcomingEpisodes = async (): Promise<UpcomingEpisode[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: UPCOMING_EPISODES_QUERY,
        variables: {
          page: 1,
          perPage: 12
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AniListResponse = await response.json();

    if (!data?.data?.Page?.media) {
      throw new Error('Format de réponse invalide');
    }

    return data.data.Page.media
      .filter(anime => anime.nextAiringEpisode)
      .map(anime => ({
        id: anime.id,
        title: anime.title.english || anime.title.romaji,
        poster: anime.coverImage.large,
        banner: anime.bannerImage,
        nextEpisode: anime.nextAiringEpisode!.episode,
        airingAt: anime.nextAiringEpisode!.airingAt,
        timeUntilAiring: anime.nextAiringEpisode!.timeUntilAiring,
        description: anime.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        genres: anime.genres.slice(0, 3),
        rating: anime.averageScore ? Math.round(anime.averageScore / 10) / 10 : undefined
      }))
      .sort((a, b) => a.timeUntilAiring - b.timeUntilAiring);

  } catch (error) {
    console.error('Erreur lors de la récupération des épisodes à venir:', error);
    
    // Données de fallback
    return [
      {
        id: 1,
        title: "Attack on Titan: Final Season",
        poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        nextEpisode: 12,
        airingAt: Date.now() + 86400000,
        timeUntilAiring: 86400,
        description: "La bataille finale pour l'humanité approche...",
        genres: ["Action", "Drame", "Fantastique"],
        rating: 9.0
      },
      {
        id: 2,
        title: "Demon Slayer: Hashira Training Arc",
        poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        nextEpisode: 8,
        airingAt: Date.now() + 172800000,
        timeUntilAiring: 172800,
        description: "L'entraînement des Piliers commence...",
        genres: ["Action", "Surnaturel", "Historique"],
        rating: 8.7
      }
    ];
  }
};