import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AnimeService } from './anime.service';
import { Anime } from './entities/anime.entity';
import { TagService } from './tag/tag.service';
import { GenreService } from './genre/genre.service';
import { Genre } from './entities/genre.entity';
import { Tag } from './entities/tag.entity';
import { Recommendation } from './entities/recommendation.entity';
import { RecommendationService } from './recommendation/recommendation.service';
import { PreviewRecommendationsInput } from './dto/preview-recommendations.input';

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(
    private readonly animeService: AnimeService,
    private readonly tagService: TagService,
    private readonly genreService: GenreService,
    private readonly recommendationService: RecommendationService
  ) {}

  @Query(() => [Tag], { name: 'tag' })
  findAllTags() {
    return this.tagService.findAll();
  }

  @Query(() => [Genre], { name: 'genre' })
  findAllGenres() {
    return this.genreService.findAll();
  }

  @Query(() => [Recommendation], {name: 'recommendation'})
  getPreviewRecommendations(@Args('input') input: PreviewRecommendationsInput) {
    return this.recommendationService.getPreviewRecommendations(input)
  }

  @Query(() => [Anime], { name: 'anime' })
  findAllAnime() {
    return this.animeService.findAll();
  }

  @Query(() => Anime, { name: 'anime' })
  findOneAnime(@Args('id', { type: () => String }) id: string) {
    return this.animeService.findOne(id);
  }

  @Mutation(() => Anime)
  removeAnime(@Args('id', { type: () => String }) id: string) {
    return this.animeService.remove(id);
  }
}
