import { InputType, Field } from "@nestjs/graphql";
import { ArrayMinSize, IsArray, IsString, MinLength } from "class-validator";
import { Member, memberRoles } from "../entities/chat.entity";

@InputType()
export class MemberInput {
  @Field(() => String)
  _id: string;

  @Field(() => memberRoles)
  role: memberRoles;
}

@InputType()
export class CreateChatInput {
  @Field(() => String)
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => [MemberInput])
  @IsArray()
  @ArrayMinSize(1)
  members: Member[];
}
