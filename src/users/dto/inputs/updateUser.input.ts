import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

import { IsString, MinLength } from "class-validator";

@InputType()
export class UpdateUserInput {
  @IsString()
  @MinLength(1)
  @Field(() => String)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(1)
  @Field(() => String)
  @ApiProperty()
  username: string;
}