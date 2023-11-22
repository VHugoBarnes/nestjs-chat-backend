import { Resolver } from "@nestjs/graphql";
import { ChatMessagesService } from "./chat-messages.service";
import { ChatMessage } from "./entities/chat-message.entity";

@Resolver(() => ChatMessage)
export class ChatMessagesResolver {
  constructor(private readonly chatMessagesService: ChatMessagesService) { }
}
