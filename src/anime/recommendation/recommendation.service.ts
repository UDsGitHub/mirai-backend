import { Injectable } from '@nestjs/common';
import { AnilistService } from 'src/anilist/anilist.service';
import { PreviewRecommendationsInput } from '../dto/preview-recommendations.input';
import { TagService } from '../tag/tag.service';
import { GenreService } from '../genre/genre.service';
import { Recommendation } from '../entities/recommendation.entity';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly anilistService: AnilistService,
    private readonly tagService: TagService,
    private readonly genreService: GenreService,
  ) {}

  async getPreviewRecommendations(input: PreviewRecommendationsInput): Promise<Recommendation[]> {
    const { genreIds, tagIds, limit } = input;

    const genreNames = (await this.genreService.findAllById(genreIds)).map(genre => genre.name)
    const tagNames = ((await this.tagService.findAllById(tagIds)).map(tag => tag.name))

    const matchedAnime = await this.anilistService.getAnimePreviewRecommendations(genreNames, tagNames, limit)
    const response = matchedAnime.slice(limit).map(anime => {
      const matchedGenres = anime.genres.filter(genre => genreIds.includes(genre.genreId)).length
      const matchedTags = anime.tags.filter(tag => tagIds.includes(tag.tagId)).length

      const matchPercentage = (matchedGenres + matchedTags) / (genreIds.length + tagIds.length)
      return {
        ...anime,
        matchPercentage
      }
    })

    return response
  }
}
