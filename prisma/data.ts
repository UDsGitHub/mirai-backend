import { readFileSync } from 'fs';
import path from 'path';

type AnilistData = {
  data: {
    MediaTagCollection: AnilistTag[];
    GenreCollection: string[];
  };
};

export type AnilistTag = {
  id: number;
  name: string;
  category: string;
  isAdult: boolean;
};

export const ANILIST_CATEGORY_TO_UI_GROUP_LABEL: Record<string, string> = {
  'Cast-Main Cast': 'Main cast',
  'Cast-Traits': 'Characters & traits',
  Demographic: 'Audience',
  Setting: 'Setting',
  'Setting-Scene': 'Setting',
  'Setting-Time': 'Time period',
  'Setting-Universe': 'World',
  'Theme-Action': 'Action',
  'Theme-Arts': 'Arts & culture',
  'Theme-Arts-Music': 'Music',
  'Theme-Comedy': 'Comedy',
  'Theme-Drama': 'Tone & drama',
  'Theme-Fantasy': 'Fantasy & supernatural',
  'Theme-Game': 'Games',
  'Theme-Game-Card & Board Game': 'Games',
  'Theme-Game-Sport': 'Sports',
  'Theme-Other': 'Other themes',
  'Theme-Other-Organisations': 'Organisations',
  'Theme-Other-Vehicle': 'Vehicles',
  'Theme-Romance': 'Romance',
  'Theme-Sci-Fi': 'Sci-fi',
  'Theme-Sci-Fi-Mecha': 'Mecha',
  'Theme-Slice of Life': 'Slice of life',
};

export const EXCLUDED_ANILIST_TAG_CATEGORIES = ['Technical', 'Sexual Content'];
export const EXCLUDED_ANILIST_GENRE_NAMES = ['Ecchi', 'Hentai'];

export function toUiGroupLabel(anilistCategory: string): string {
  return ANILIST_CATEGORY_TO_UI_GROUP_LABEL[anilistCategory] ?? anilistCategory;
}

const anilistData = readFileSync(path.join(__dirname, 'data.json'), 'utf8');
const anilistDataJson = JSON.parse(anilistData) as AnilistData;

export const anilistTags: AnilistTag[] =
  anilistDataJson.data.MediaTagCollection.map((tag) => ({
    id: tag.id,
    name: tag.name,
    category: toUiGroupLabel(tag.category),
    isAdult: tag.isAdult,
  }));

export const anilistGenres: string[] = anilistDataJson.data.GenreCollection;
