import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AnilistClient } from './anilist.client';
import { AnilistService } from './anilist.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [HttpModule],
  providers: [AnilistClient, AnilistService, PrismaService],
  exports: [AnilistService],
})
export class AnilistModule {}
