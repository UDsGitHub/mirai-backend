import { Test, TestingModule } from '@nestjs/testing';
import { AnimeResolver } from './anime.resolver';
import { AnimeService } from './anime.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';
import { TagService } from './tag/tag.service';
import { GenreService } from './genre/genre.service';

describe('AnimeResolver', () => {
  let resolver: AnimeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeResolver,
        AnimeService,
        TagService,
        GenreService,
        PrismaService,
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    }).compile();

    resolver = module.get<AnimeResolver>(AnimeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
