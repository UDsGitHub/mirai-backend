import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { AnimeResolver } from './anime.resolver';
import { PrismaService } from '../prisma.service';
import { TagService } from './tag/tag.service';
import { GenreService } from './genre/genre.service';

@Module({
  providers: [
    AnimeResolver,
    AnimeService,
    PrismaService,
    TagService,
    GenreService,
  ],
})
export class AnimeModule {}
