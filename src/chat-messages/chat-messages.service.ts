import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { NewMessageDto } from "./dto";
import { ObjectId } from "../common/types";
import { ChatMessage } from "./entities/chat-message.entity";
import { ChatService } from "../chat/chat.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessagesModel: Model<ChatMessage>,

    private readonly chatService: ChatService
  ) { }

  async addMessage(newMessageDto: NewMessageDto, user: User, files?: Express.Multer.File[]) {
    const chat = await this.chatService.isRoomMember(user, newMessageDto.room_id);

    // Upload files and get urls

    // Build new message

    // Save new message
  }

  async getLastMessage(room_id: ObjectId, user: User) {
    // Check user is member

    // Retrieve newest message
  }

  async getMessages() { }
}
