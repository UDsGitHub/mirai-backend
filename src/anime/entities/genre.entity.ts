import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Genre {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
