import { ObjectType } from "@nestjs/graphql";
import { Schema } from "@nestjs/mongoose";
import { MessagesTypes } from "../enums/messages.enum";

@Schema()
@ObjectType()
export class ChatMessage {
  id: string;

  from: string;

  chatroom_id: string;

  at: Date;

  type: MessagesTypes;

  content: string;

  url: string;
};