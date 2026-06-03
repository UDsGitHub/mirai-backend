import { readFileSync } from 'fs';
import path from 'path';

type AnilistData = {
  data: {
    MediaTagCollection: AnilistTag[];
    GenreCollection: string[];
  };
};

type AnilistTag = {
  id: number;
  name: string;
  category: string;
  isAdult: boolean;
};

const anilistData = readFileSync(path.join(__dirname, 'data.json'), 'utf8');
const anilistDataJson = JSON.parse(anilistData) as AnilistData;

export const anilistTags: AnilistTag[] =
  anilistDataJson.data.MediaTagCollection;
export const anilistGenres: string[] =
  anilistDataJson.data.GenreCollection;
