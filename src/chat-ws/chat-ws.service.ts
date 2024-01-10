import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { WsException } from "@nestjs/websockets";
import { Model } from "mongoose";
import { ChatService } from "src/chat/chat.service";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ChatWsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly chatService: ChatService,
    private readonly usersService: UsersService
  ) { }

  async userCanJoinRoom(userId: string, room_id: string) {
    try {
      const user = await this.usersService.findById(userId);
      await this.chatService.isRoomMember(user, room_id);
    } catch (error) {
      throw new WsException(error);
    }
  }
}
