import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { AnilistService } from '../anilist/anilist.service';
import { AnimeResolver } from './anime.resolver';
import { AnimeService } from './anime.service';
import { GenreService } from './genre/genre.service';
import { RecommendationService } from './recommendation/recommendation.service';
import { TagService } from './tag/tag.service';

describe('AnimeResolver', () => {
  let resolver: AnimeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeResolver,
        AnimeService,
        RecommendationService,
        TagService,
        GenreService,
        PrismaService,
        {
          provide: AnilistService,
          useValue: {
            fetchAndSyncPreviewMedia: jest.fn(),
          },
        },
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
