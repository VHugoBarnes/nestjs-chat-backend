import { Field, ID, InputType } from "@nestjs/graphql";
import { IsMongoId, IsString, MinLength } from "class-validator";

@InputType()
export class UpdateUserInput {
  @IsMongoId()
  @Field(() => ID)
  _id: string;

  @IsString()
  @MinLength(1)
  @Field(() => String)
  name: string;

  @IsString()
  @MinLength(1)
  @Field(() => String)
  username: string;
}