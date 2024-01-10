import { Module } from "@nestjs/common";
import { ChatWsService } from "./chat-ws.service";
import { ChatWsGateway } from "./chat-ws.gateway";
import { ChatMessagesModule } from "src/chat-messages/chat-messages.module";
import { AuthModule } from "src/auth/auth.module";
import { ChatModule } from "src/chat/chat.module";
import { UsersModule } from "src/users/users.module";

@Module({
  providers: [ChatWsGateway, ChatWsService],
  imports: [
    ChatModule,
    ChatMessagesModule,
    UsersModule,
    AuthModule
  ]
})
export class ChatWsModule { }
