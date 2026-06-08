import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Anime {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
