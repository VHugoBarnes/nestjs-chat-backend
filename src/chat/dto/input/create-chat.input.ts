import { InputType, Field } from "@nestjs/graphql";
import { mongo } from "mongoose";
import { Transform } from "class-transformer";
import validator from "validator";
import { ArrayMinSize, IsArray, IsMongoId, IsString, MinLength } from "class-validator";

import { Member, memberRoles } from "../../entities/chat.entity";

@InputType()
export class MemberInput {
  @Field(() => String)
  @IsMongoId()
  _id: mongo.ObjectId;

  @Field(() => memberRoles)
  role: memberRoles;
}

@InputType()
export class CreateChatInput {
  @Field(() => String)
  @IsString()
  @MinLength(2)
  @Transform((params: { value: string }) => validator.escape(params.value.trim()))
  name: string;

  @Field(() => [MemberInput])
  @IsArray()
  @ArrayMinSize(1)
  members: Member[];
}
