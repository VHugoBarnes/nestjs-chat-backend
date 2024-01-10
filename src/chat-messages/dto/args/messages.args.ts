import { ArgsType, Field } from "@nestjs/graphql";
import { IsMongoId, IsOptional, IsString } from "class-validator";

@ArgsType()
export class MessagesArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsMongoId()
  messageId?: string;
}