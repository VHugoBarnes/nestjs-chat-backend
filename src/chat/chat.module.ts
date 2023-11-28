import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatResolver } from "./chat.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./entities/chat.entity";
import { UsersModule } from "src/users/users.module";

@Module({
  providers: [ChatResolver, ChatService],
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    UsersModule
  ]
})
export class ChatModule { }
