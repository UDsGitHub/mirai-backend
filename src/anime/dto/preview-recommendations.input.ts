import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class PreviewRecommendationsInput {
    @Field(() => [Int])
    genreIds: number[] = []

    @Field(() => [Int])
    tagIds: number[] = []

    @Field(() => Int)
    limit: number = 6
}