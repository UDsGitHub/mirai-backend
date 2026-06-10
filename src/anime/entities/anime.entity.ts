import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Anime {
  @Field(() => String)
  id: string;

  @Field(() => String)
  titleRomaji: string;

  @Field(() => String, { nullable: true })
  titleEnglish?: string | null;

  @Field(() => String, { nullable: true })
  synopsis?: string | null;

  @Field(() => Int, { nullable: true })
  episodeCount?: number | null;

  @Field(() => String, { nullable: true })
  status?: string | null;

  @Field(() => String, { nullable: true })
  season?: string | null;

  @Field(() => Int, { nullable: true })
  seasonYear?: number | null;

  @Field(() => Float, { nullable: true })
  averageScore?: number | null;

  @Field(() => Int, { nullable: true })
  popularity?: number | null;

  @Field(() => String, { nullable: true })
  bannerUrl?: string | null;

  @Field(() => String, { nullable: true })
  coverUrl?: string | null;

  @Field(() => String, { nullable: true })
  trailerUrl?: string | null;
}
