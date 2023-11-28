import { InputType, Field } from "@nestjs/graphql";
import { IsString, MinLength } from "class-validator";

@InputType()
export class CreateChatInput {
  @Field(() => String)
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => [String])
  @MinLength(1)
  members: string[];
}
