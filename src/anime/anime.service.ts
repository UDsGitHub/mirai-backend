import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnimeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.anime.findMany();
  }

  findOne(id: string) {
    return this.prisma.anime.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.anime.delete({ where: { id } });
  }
}
