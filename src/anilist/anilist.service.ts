import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GET_ANIME_PREVIEW_RECOMMENDATIONS } from '../anime/recommendation/recommendation.query';
import { AnilistClient } from './anilist.client';
import {
  AnilistMedia,
  AnilistPreviewQueryResult,
  SyncedAnimeWithRelations,
} from './anilist.types';

@Injectable()
export class AnilistService {
  constructor(
    private readonly anilistClient: AnilistClient,
    private readonly prisma: PrismaService,
  ) {}

  async fetchAndSyncPreviewMedia(
    genreNames: string[],
    tagNames: string[],
    perPage: number,
  ): Promise<SyncedAnimeWithRelations[]> {
    const response = await this.anilistClient.query<AnilistPreviewQueryResult>(
      GET_ANIME_PREVIEW_RECOMMENDATIONS,
      {
        genreIn: genreNames,
        tagIn: tagNames,
        perPage,
      },
    );

    return this.syncMediaBatch(response.Page.media);
  }

  private async syncMediaBatch(
    media: AnilistMedia[],
  ): Promise<SyncedAnimeWithRelations[]> {
    if (media.length === 0) {
      return [];
    }

    return this.prisma.$transaction(async (tx) => {
      const results: SyncedAnimeWithRelations[] = [];

      for (const item of media) {
        const animeData = this.toAnimeData(item);
        const anime = await tx.anime.upsert({
          where: { externalId: item.id },
          create: animeData,
          update: animeData,
        });

        const genreRecords = await tx.genre.findMany({
          where: { name: { in: item.genres } },
        });

        await tx.animeGenre.deleteMany({ where: { animeId: anime.id } });
        if (genreRecords.length > 0) {
          await tx.animeGenre.createMany({
            data: genreRecords.map((genre) => ({
              animeId: anime.id,
              genreId: genre.id,
            })),
            skipDuplicates: true,
          });
        }

        const tagExternalIds = item.tags.map((tag) => tag.id);
        const tagRecords = await tx.tag.findMany({
          where: { externalId: { in: tagExternalIds } },
        });

        await tx.animeTag.deleteMany({ where: { animeId: anime.id } });
        if (tagRecords.length > 0) {
          await tx.animeTag.createMany({
            data: tagRecords.map((tag) => ({
              animeId: anime.id,
              tagId: tag.id,
            })),
            skipDuplicates: true,
          });
        }

        const genres = await tx.animeGenre.findMany({
          where: { animeId: anime.id },
        });
        const tags = await tx.animeTag.findMany({
          where: { animeId: anime.id },
        });

        results.push({ ...anime, genres, tags });
      }

      return results;
    });
  }

  private toAnimeData(media: AnilistMedia) {
    return {
      externalId: media.id,
      titleRomaji: media.title.romaji,
      titleEnglish: media.title.english,
      synopsis: media.description,
      episodeCount: media.episodes,
      status: media.status,
      season: media.season,
      seasonYear: media.seasonYear,
      averageScore: media.averageScore,
      popularity: media.popularity,
      bannerUrl: media.bannerImage,
      coverUrl: media.coverImage?.large ?? media.coverImage?.medium ?? null,
      trailerUrl: media.trailer?.site ?? null,
      syncedAt: new Date(),
    };
  }
}
