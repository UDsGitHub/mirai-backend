import { Module } from '@nestjs/common';
import { AnilistService } from './anilist.service';
import { PrismaService } from 'src/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AnilistService, PrismaService],
})
export class AnilistModule {}
