import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Anime {
  @Field(() => String)
  id: string;

  @Field(() => String)
  titleRomaji: string;

  @Field(() => String)
  titleEnglish: string;

  @Field(() => String)
  synopsis: string;

  @Field(() => Int)
  episodeCount: number;

  @Field(() => String)
  status: string;

  @Field(() => String)
  season: string;

  @Field(() => Int)
  seasonYear: number;

  @Field(() => Float)
  averageScore: number;

  @Field(() => Int)
  popularity: number;

  @Field(() => String)
  bannerUrl: string;

  @Field(() => String)
  coverUrl: string;

  @Field(() => String)
  trailerUrl: string;
}
