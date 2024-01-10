import { ObjectType, Field } from "@nestjs/graphql";
import { ChatMessage } from "../../../chat-messages/entities/chat-message.entity";

@ObjectType()
export class ChatResponse {
  @Field(() => Boolean)
  has_more: boolean;

  @Field(() => [ChatMessage])
  messages: ChatMessage[];
}