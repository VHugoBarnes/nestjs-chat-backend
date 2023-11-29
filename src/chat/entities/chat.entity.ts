import { ObjectType, Field, ID, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MSchema } from "mongoose";

export enum memberRoles {
  admin = "admin",
  member = "member"
};

registerEnumType(memberRoles, { name: "memberRoles" });

export type Member = {
  _id: string;
  role: memberRoles
};

export class MemberGql {
  @Prop({ type: MSchema.Types.ObjectId, ref: "User" })
  @Field(() => String)
  _id: MSchema.Types.ObjectId;

  @Prop({ type: String, enum: memberRoles })
  @Field(() => memberRoles, { nullable: true })
  role: memberRoles;
}

@Schema({ timestamps: true })
@ObjectType()
export class Chat {
  @Prop({ type: MSchema.Types.ObjectId })
  @Field(() => ID)
  _id: string;

  @Prop({ type: String, index: true })
  @Field(() => String)
  name: string;

  @Prop({ type: String, unique: true })
  @Field(() => String)
  room_id: string;

  @Prop({ type: [MemberGql] })
  members: Member[];

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
