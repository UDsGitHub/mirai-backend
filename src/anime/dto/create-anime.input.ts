import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnimeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
