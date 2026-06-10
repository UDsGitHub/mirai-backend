import { Injectable } from '@nestjs/common';
import { AnilistService } from '../../anilist/anilist.service';
import { SyncedAnimeWithRelations } from '../../anilist/anilist.types';
import { PreviewRecommendationsInput } from '../dto/preview-recommendations.input';
import { Recommendation } from '../entities/recommendation.entity';
import { GenreService } from '../genre/genre.service';
import { TagService } from '../tag/tag.service';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly anilistService: AnilistService,
    private readonly tagService: TagService,
    private readonly genreService: GenreService,
    private readonly prismaService: PrismaService,
  ) {}

  async getPreviewRecommendations(
    input: PreviewRecommendationsInput,
  ): Promise<Recommendation[]> {
    const { genreIds, tagIds, limit } = input;

    if (genreIds.length === 0 && tagIds.length === 0) {
      return [];
    }

    const genres = await this.genreService.findAllById(genreIds);
    const tags = await this.tagService.findAllById(tagIds);

    const genreNames = genres.map((genre) => genre.name);
    const tagNames = tags.map((tag) => tag.name);
    const perPage = Math.max(limit * 4, 24);

    const syncedAnime = await this.anilistService.fetchAndSyncPreviewMedia(
      genreNames,
      tagNames,
      perPage,
    );

    const genreNameById = await this.loadGenreNames(syncedAnime);
    const tagNameById = await this.loadTagNames(syncedAnime);

    return syncedAnime
      .map((anime) =>
        this.toRecommendation(
          anime,
          genreIds,
          tagIds,
          genreNameById,
          tagNameById,
        ),
      )
      .sort((left, right) => {
        if (right.matchPercentage !== left.matchPercentage) {
          return right.matchPercentage - left.matchPercentage;
        }

        return (right.averageScore ?? 0) - (left.averageScore ?? 0);
      })
      .slice(0, limit);
  }

  private async loadGenreNames(
    syncedAnime: SyncedAnimeWithRelations[],
  ): Promise<Map<number, string>> {
    const genreIds = [
      ...new Set(
        syncedAnime.flatMap((anime) =>
          anime.genres.map((genre) => genre.genreId),
        ),
      ),
    ];

    if (genreIds.length === 0) {
      return new Map();
    }

    const genres = await this.prismaService.genre.findMany({
      where: { id: { in: genreIds } },
      select: { id: true, name: true },
    });

    return new Map(genres.map((genre) => [genre.id, genre.name]));
  }

  private async loadTagNames(
    syncedAnime: SyncedAnimeWithRelations[],
  ): Promise<Map<number, string>> {
    const tagIds = [
      ...new Set(
        syncedAnime.flatMap((anime) => anime.tags.map((tag) => tag.tagId)),
      ),
    ];

    if (tagIds.length === 0) {
      return new Map();
    }

    const tags = await this.prismaService.tag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true, name: true },
    });

    return new Map(tags.map((tag) => [tag.id, tag.name]));
  }

  private toRecommendation(
    anime: SyncedAnimeWithRelations,
    genreIds: number[],
    tagIds: number[],
    genreNameById: Map<number, string>,
    tagNameById: Map<number, string>,
  ): Recommendation {
    const matchedGenres = anime.genres.filter((genre) =>
      genreIds.includes(genre.genreId),
    ).length;
    const matchedTags = anime.tags.filter((tag) =>
      tagIds.includes(tag.tagId),
    ).length;
    const preferenceCount = genreIds.length + tagIds.length;
    const matchPercentage =
      preferenceCount === 0
        ? 0
        : ((matchedGenres + matchedTags) / preferenceCount) * 100;

    return {
      id: anime.id,
      titleRomaji: anime.titleRomaji,
      titleEnglish: anime.titleEnglish ?? anime.titleRomaji,
      synopsis: anime.synopsis ?? '',
      episodeCount: anime.episodeCount ?? 0,
      status: anime.status ?? '',
      season: anime.season ?? '',
      seasonYear: anime.seasonYear ?? 0,
      averageScore: anime.averageScore ?? 0,
      popularity: anime.popularity ?? 0,
      bannerUrl: anime.bannerUrl ?? '',
      coverUrl: anime.coverUrl ?? '',
      trailerUrl: anime.trailerUrl ?? '',
      genres: anime.genres
        .map((genre) => genreNameById.get(genre.genreId))
        .filter((name): name is string => name !== undefined),
      tags: anime.tags
        .map((tag) => tagNameById.get(tag.tagId))
        .filter((name): name is string => name !== undefined),
      matchPercentage,
    };
  }
}
