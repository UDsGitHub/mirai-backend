import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AnimeService } from './anime.service';
import { Anime } from './entities/anime.entity';
import { TagService } from './tag/tag.service';
import { GenreService } from './genre/genre.service';
import { Genre } from './entities/genre.entity';
import { Tag } from './entities/tag.entity';

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(
    private readonly animeService: AnimeService,
    private readonly tagService: TagService,
    private readonly genreService: GenreService,
  ) {}

  @Query(() => [Tag], { name: 'tag' })
  findAllTags() {
    return this.tagService.findAll();
  }

  @Query(() => [Genre], { name: 'genre' })
  findAllGenres() {
    return this.genreService.findAll();
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
