import { Module, forwardRef } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatResolver } from "./chat.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./entities/chat.entity";
import { UsersModule } from "src/users/users.module";
import { ChatMessagesModule } from "src/chat-messages/chat-messages.module";

@Module({
  providers: [ChatResolver, ChatService],
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    UsersModule,
    forwardRef(() => ChatMessagesModule)
  ],
  exports: [
    ChatService,
  ]
})
export class ChatModule { }
