import { Injectable } from "@nestjs/common";
import { CreateChatInput } from "./dto/create-chat.input";
import { UpdateChatInput } from "./dto/update-chat.input";
import { Model } from "mongoose";
import { Chat } from "./entities/chat.entity";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<Chat>,

    private readonly usersService: UsersService
  ) { }

  create(createChatInput: CreateChatInput, user: User) {
    return "This action adds a new chat";
  }

  findAll() {
    return "This action returns all chat";
  }

  findOne(id: string) {
    return `This action returns a #${id} chat`;
  }

  update(id: string, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: string) {
    return `This action removes a #${id} chat`;
  }
}
