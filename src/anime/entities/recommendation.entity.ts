import { Field, Float, ObjectType } from "@nestjs/graphql";
import { Anime } from "./anime.entity";

@ObjectType()
export class Recommendation extends Anime
{
    @Field(() => Float)
    matchPercentage: number
}