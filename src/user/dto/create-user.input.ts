import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  userId: string

  @Field({ nullable: true })
  displayName?: string

  @Field({ nullable: true })
  avatarUrl?: string

  @Field()
  birthDate: Date

  @Field(() => [Number])
  genrePreferences: number[]

  @Field(() => [Number])
  tagPreferences: number[]

  @Field({nullable: true})
  bio?: string
}
