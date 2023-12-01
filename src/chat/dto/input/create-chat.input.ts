import { InputType, Field } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import validator from "validator";
import { ArrayMinSize, IsArray, IsMongoId, IsString, MinLength } from "class-validator";

import { Member, memberRoles } from "../../entities/chat.entity";
import { ObjectId } from "src/common/types";

@InputType()
export class MemberInput {
  @Field(() => String)
  @IsMongoId()
  _id: ObjectId;

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
