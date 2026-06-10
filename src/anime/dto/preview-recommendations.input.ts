import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsOptional, Max, Min } from 'class-validator';

@InputType()
export class PreviewRecommendationsInput {
  @Field(() => [Int], { defaultValue: [] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  genreIds: number[] = [];

  @Field(() => [Int], { defaultValue: [] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds: number[] = [];

  @Field(() => Int, { defaultValue: 6 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 6;
}
