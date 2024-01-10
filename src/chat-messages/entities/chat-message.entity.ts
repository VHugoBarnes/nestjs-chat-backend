import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { mongo } from "mongoose";
import { MessagesTypes } from "../enums/messages.enum";
import { ObjectId } from "src/common/types";
import { User } from "src/users/entities/user.entity";

@Schema()
@ObjectType()
export class ChatMessage {
  @Prop({ type: mongo.ObjectId })
  @Field(() => ID)
  _id: ObjectId;

  @Prop({ type: mongo.ObjectId, ref: "User" })
  @Field(() => User)
  from: ObjectId;

  @Prop({ type: mongo.ObjectId, ref: "Chat" })
  @Field(() => ID)
  chatroom_id: ObjectId;

  @Prop({ type: Date })
  @Field(() => Date)
  at: Date;

  @Prop({ type: String, enum: MessagesTypes })
  @Field(() => MessagesTypes)
  type: MessagesTypes;

  @Prop({ type: String })
  @Field(() => String)
  content: string;

  @Prop({ type: [String], required: false })
  @Field(() => [String], { nullable: true })
  url: string[];
};

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);