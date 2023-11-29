import { ObjectType, Field, ID, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { mongo } from "mongoose";
import { User } from "src/users/entities/user.entity";

export enum memberRoles {
  admin = "admin",
  member = "member"
};

registerEnumType(memberRoles, { name: "memberRoles" });

export type Member = {
  _id: mongo.ObjectId;
  role: memberRoles
};

@ObjectType()
export class MemberGql {
  @Prop({ type: mongo.ObjectId, ref: "User" })
  @Field(() => User, { name: "user" })
  _id: mongo.ObjectId;

  @Prop({ type: String, enum: memberRoles })
  @Field(() => memberRoles, { nullable: true })
  role: memberRoles;
}

@Schema({ timestamps: true })
@ObjectType()
export class Chat {
  @Prop({ type: mongo.ObjectId })
  @Field(() => ID)
  @ApiProperty({ name: "_id", description: "Id of Chat Schema", example: "65677344e8e970c44636ec00" })
  _id: mongo.ObjectId;

  @Prop({ type: String, index: true })
  @Field(() => String)
  @ApiProperty({ name: "name", description: "The name of the Chatroom", example: "Friends chat" })
  name: string;

  @Prop({ type: String, unique: true })
  @Field(() => String)
  @ApiProperty({ name: "room_id" })
  room_id: string;

  @Prop({ type: [MemberGql] })
  @Field(() => [MemberGql])
  members: Member[];

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
