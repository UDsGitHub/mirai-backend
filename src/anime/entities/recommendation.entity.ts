import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Anime } from './anime.entity';

@ObjectType()
export class Recommendation extends Anime {
  @Field(() => [String], { nullable: true })
  genres: string[];

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field(() => Float)
  matchPercentage: number;
}
