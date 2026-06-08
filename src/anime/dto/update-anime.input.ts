import { CreateAnimeInput } from './create-anime.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnimeInput extends PartialType(CreateAnimeInput) {
  @Field(() => Int)
  id: number;
}
