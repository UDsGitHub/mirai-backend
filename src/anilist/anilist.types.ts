export type AnilistMediaTitle = {
  romaji: string;
  english: string | null;
};

export type AnilistMediaTag = {
  id: number;
  name: string;
};

export type AnilistMediaTrailer = {
  id: string;
  site: string;
} | null;

export type AnilistMedia = {
  id: number;
  title: AnilistMediaTitle;
  description: string | null;
  episodes: number | null;
  status: string | null;
  season: string | null;
  seasonYear: number | null;
  averageScore: number | null;
  popularity: number | null;
  bannerImage: string | null;
  coverImage: {
    large: string | null;
    medium: string | null;
  } | null;
  trailer: AnilistMediaTrailer;
  genres: string[];
  tags: AnilistMediaTag[];
};

export type AnilistPreviewQueryResult = {
  Page: {
    media: AnilistMedia[];
  };
};

export type SyncedAnimeWithRelations = {
  id: string;
  externalId: number;
  titleRomaji: string;
  titleEnglish: string | null;
  synopsis: string | null;
  episodeCount: number | null;
  status: string | null;
  season: string | null;
  seasonYear: number | null;
  averageScore: number | null;
  popularity: number | null;
  bannerUrl: string | null;
  coverUrl: string | null;
  trailerUrl: string | null;
  syncedAt: Date;
  genres: { animeId: string; genreId: number }[];
  tags: { animeId: string; tagId: number }[];
};
