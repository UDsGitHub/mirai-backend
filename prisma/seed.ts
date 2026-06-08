import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import {
  anilistGenres,
  anilistTags,
  EXCLUDED_ANILIST_GENRE_NAMES,
  EXCLUDED_ANILIST_TAG_CATEGORIES,
} from './data';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.animeTag.deleteMany();
  await prisma.userTagPreference.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.animeGenre.deleteMany();
  await prisma.genre.deleteMany();

  const tags = await prisma.tag.createMany({
    data: anilistTags
      .filter(
        (tag) =>
          !tag.isAdult &&
          !EXCLUDED_ANILIST_TAG_CATEGORIES.includes(tag.category),
      )
      .map((tag) => ({
        externalId: tag.id,
        name: tag.name,
        category: tag.category,
        isAdult: tag.isAdult,
      })),
  });
  const genres = await prisma.genre.createMany({
    data: anilistGenres
      .filter((genre) => !EXCLUDED_ANILIST_GENRE_NAMES.includes(genre))
      .map((genre) => ({
        name: genre,
      })),
  });
  console.log({ tags, genres });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
