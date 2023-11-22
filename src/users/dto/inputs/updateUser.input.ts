import { Field, InputType } from "@nestjs/graphql";

import { IsString, MinLength } from "class-validator";

@InputType()
export class UpdateUserInput {
  @IsString()
  @MinLength(1)
  @Field(() => String)
  name: string;

  @IsString()
  @MinLength(1)
  @Field(() => String)
  username: string;
}