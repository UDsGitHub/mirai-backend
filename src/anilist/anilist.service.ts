import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AnilistClient } from './anilist.client';
import { GetAnimeRecommendationsByFilter } from '../anime/recommendation/recommendation.query';
import { Recommendation } from 'src/anime/entities/recommendation.entity';
import { TagService } from 'src/anime/tag/tag.service';
import { GetAnimePreviewRecommendationsResponse } from './anilist.types';

@Injectable()
export class AnilistService {
  constructor(
    private readonly anilistClient: AnilistClient,
    private readonly prisma: PrismaService,
    private readonly tagService: TagService,
  ) {}

  async getAnimePreviewRecommendations(
    genres: string[],
    tags: string[],
    limit: number,
  ) {
    const rawAniListResponse = (await this.anilistClient.query(
      GetAnimeRecommendationsByFilter,
      {
        genres,
        tags,
      },
    )) as any[];

    console.log(rawAniListResponse);

    return this.prisma.$transaction(async (tx) => {
      const animeGenresAndTags = {};
      const response: GetAnimePreviewRecommendationsResponse[] = []

      const parsedAnime = rawAniListResponse.slice(limit).map(async (anime) => {
        const tagIds = (
          await this.tagService.findAllById(anime.tags.map((tag) => tag.id))
        ).map((tag) => tag.id);

        animeGenresAndTags[anime.externalId] = {
          genres: anime.genres,
          tags: tagIds,
        };

        return {
          externalId: anime.externalId,
          titleRomaji: anime.title.romaji,
          titleEnglish: anime.title.english,
          synopsis: anime.description,
          episodeCount: anime.episodes,
          status: anime.status,
          season: anime.season,
          seasonYear: anime.seasonYear,
          averageScore: anime.averageScore,
          popularity: anime.popularity,
          bannerUrl: anime.bannerImage,
          coverUrl: anime.coverImage,
          trailerUrl: anime.trailer.site,
          syncedAt: new Date(),
        };
      });

      const insertedAnime = await this.prisma.anime.createManyAndReturn({
        data: parsedAnime,
        skipDuplicates: true,
      });

      insertedAnime.forEach(async (anime) => {
        const insertedGenre = await this.prisma.animeGenre.createManyAndReturn({
          data: animeGenresAndTags[anime.externalId].genres,
          skipDuplicates: true
        });
        const insertedTags = await this.prisma.animeTag.createManyAndReturn({
          data: insertedAnime.map(
            (anime) => animeGenresAndTags[anime.externalId].tags,
          ),
          skipDuplicates: true
        });
        response.push({
            ...insertedAnime,
            genres: insertedGenre,
            tags: insertedTags
        })
      });
      
      return response
    });
  }
}
