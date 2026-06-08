import { Test, TestingModule } from '@nestjs/testing';
import { AnimeService } from './anime.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('AnimeService', () => {
  let service: AnimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimeService, PrismaService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    }).compile();

    service = module.get<AnimeService>(AnimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
