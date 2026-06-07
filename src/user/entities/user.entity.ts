import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserProfile {
  @Field()
  userId: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field()
  birthDate: Date;

  @Field(() => [Number])
  genrePreferences: number[];

  @Field(() => [Number])
  tagPreferences: number[];

  @Field({ nullable: true })
  bio?: string;

  @Field()
  createdAt: Date;
}
