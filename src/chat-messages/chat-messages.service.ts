import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { NewMessageDto } from "./dto";
import { ChatMessage } from "./entities/chat-message.entity";
import { ChatService } from "../chat/chat.service";
import { User } from "../users/entities/user.entity";
import { MessagesTypes } from "./enums/messages.enum";
import { ObjectId } from "../common/types";

const PAGE_SIZE: number = 20;

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessagesModel: Model<ChatMessage>,

    private readonly chatService: ChatService
  ) { }

  async addMessage(newMessageDto: NewMessageDto, user: User, files?: Express.Multer.File[]): Promise<ChatMessage> {
    const chat = await this.chatService.isRoomMember(user, newMessageDto.room_id);

    // Upload files and get urls
    console.log(files);

    // Build new message
    // Save new message
    const newMessage = await this.chatMessagesModel.create({
      chatroom_id: chat._id,

      content: newMessageDto.content,
      from: user._id,
      at: new Date(),
      type: MessagesTypes.text,
    });

    return newMessage;
  }

  async getLastMessage(room_id: string, user: User): Promise<ChatMessage> {
    // Check user is member
    const chat = await this.chatService.isRoomMember(user, room_id);

    // Retrieve newest message
    const lastMessage = await this.chatMessagesModel.findOne({ chatroom_id: chat._id })
      .sort({ at: -1 })
      .populate({
        path: "from",
        select: "name username profilePhoto"
      })
      .exec();

    return lastMessage;
  }

  async getMessages(room_id: string, user: User, lastMessageId?: ObjectId,): Promise<{ has_more: boolean, messages: ChatMessage[] }> {
    const chat = await this.chatService.isRoomMember(user, room_id);

    type Query = {
      chatroom_id: ObjectId,
      _id?: ObjectId
    };

    const query: Query = {
      chatroom_id: chat._id
    };

    if (lastMessageId) {
      query._id = lastMessageId;
    }

    const messagesAggregation = await this.chatMessagesModel.aggregate([
      { $match: query },
      { $sort: { _id: -1 } },
      { $limit: PAGE_SIZE + 1 },
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "_id",
          as: "from",
        }
      },
      {
        $unwind: "$from"
      },
      {
        $project: {
          "from.name": 1,
          "from.username": 1,
          "from.profilePhoto": 1,
          "from._id": 1,
          "type": 1,
          "_id": 1,
          "at": 1,
          "content": 1,
          "url": 1,
        }
      }
    ]);

    const hasMore = messagesAggregation.length === PAGE_SIZE + 1;
    let messages = hasMore ? messagesAggregation.slice(0, -1) : messagesAggregation;

    messages = messages.reverse();

    return {
      has_more: hasMore,
      messages: messages
    };
  }
}
