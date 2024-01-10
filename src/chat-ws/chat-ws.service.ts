import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatService } from "src/chat/chat.service";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class ChatWsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly chatService: ChatService,
  ) { }
}
