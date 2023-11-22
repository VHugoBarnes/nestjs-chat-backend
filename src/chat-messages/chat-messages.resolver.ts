import { Resolver } from "@nestjs/graphql";
import { ChatMessagesService } from "./chat-messages.service";

@Resolver()
export class ChatMessagesResolver {
  constructor(private readonly chatMessagesService: ChatMessagesService) { }
}
