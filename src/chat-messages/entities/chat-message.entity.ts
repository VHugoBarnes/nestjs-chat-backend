import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { mongo } from "mongoose";
import { MessagesTypes } from "../enums/messages.enum";

@Schema()
@ObjectType()
export class ChatMessage {
  @Prop({ type: mongo.ObjectId })
  @Field(() => ID)
  id: mongo.ObjectId;

  @Prop({ type: mongo.ObjectId, ref: "User" })
  @Field(() => ID)
  from: mongo.ObjectId;

  @Prop({ type: mongo.ObjectId, ref: "Chat" })
  @Field(() => ID)
  chatroom_id: mongo.ObjectId;

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