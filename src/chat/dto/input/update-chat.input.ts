import { IsString } from "class-validator";
import { CreateChatInput } from "./create-chat.input";
import { InputType, Field, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateChatInput extends PartialType(CreateChatInput) {
  @Field(() => String)
  @IsString()
  room_id: string;
}
