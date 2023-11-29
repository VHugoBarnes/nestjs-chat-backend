import { Module } from "@nestjs/common";
import { ChatMessagesService } from "./chat-messages.service";
import { ChatMessagesResolver } from "./chat-messages.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatMessage, ChatMessageSchema } from "./entities/chat-message.entity";
import { ChatModule } from "src/chat/chat.module";
import { UsersModule } from "src/users/users.module";

@Module({
  providers: [
    ChatMessagesResolver,
    ChatMessagesService
  ],
  imports: [
    MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }]),
    ChatModule,
    UsersModule,
  ],
  exports: [
    ChatMessagesService,
  ]
})
export class ChatMessagesModule { }
