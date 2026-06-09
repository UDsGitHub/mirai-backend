import { Anime } from "src/anime/entities/anime.entity";
import { AnimeGenre, AnimeTag } from "src/generated/prisma";

export interface GetAnimePreviewRecommendationsResponse extends Anime {
    genres: AnimeGenre[]
    tags: AnimeTag[]
}[]