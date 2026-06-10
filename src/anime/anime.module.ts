import { Module } from '@nestjs/common';
import { AnilistModule } from '../anilist/anilist.module';
import { PrismaService } from '../prisma.service';
import { AnimeResolver } from './anime.resolver';
import { AnimeService } from './anime.service';
import { GenreService } from './genre/genre.service';
import { RecommendationService } from './recommendation/recommendation.service';
import { TagService } from './tag/tag.service';

@Module({
  imports: [AnilistModule],
  providers: [
    AnimeResolver,
    AnimeService,
    RecommendationService,
    PrismaService,
    TagService,
    GenreService,
  ],
})
export class AnimeModule {}
