import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";

import { Chat, memberRoles } from "./entities/chat.entity";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { CreateChatInput } from "./dto/create-chat.input";
import { UpdateChatInput } from "./dto/update-chat.input";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { SearchArgs } from "src/common/dto/args/search.args";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<Chat>,

    private readonly usersService: UsersService
  ) { }

  async create(createChatInput: CreateChatInput, user: User): Promise<Chat> {
    // All users exist
    const membersIds = createChatInput.members.map((m) => m._id);
    const usersExist = (await this.usersService.findInBatch(membersIds)).filter((x) => x !== null).length === createChatInput.members.length;

    if (usersExist === false) {
      throw new BadRequestException("[some-users-not-found]");
    }

    // User didn't put themselves in the members list
    if (createChatInput.members.every((m) => m._id !== user._id.toString()) === false) {
      throw new ForbiddenException();
    }

    // Create room_id
    const { nanoid } = await import("nanoid");
    const roomId = nanoid();

    // Create chat
    const chat = await this.chatModel.create({
      _id: new mongo.ObjectId(),
      ...createChatInput,
      members: [...createChatInput.members, { _id: user._id, role: memberRoles.admin }],
      room_id: roomId
    });

    return chat;
  }

  // find chats where user is part of
  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Chat[]> {
    const chats = await this.chatModel.aggregate([
      {
        $match: {
          $text: {
            $search: searchArgs.search
          },
          name: {
            $regex: searchArgs.search,
            $options: "i"
          },
        }
      },
      {
        $match: {
          "members._id": user._id.toString()
        }
      },
      { $sort: { _id: -1 } },
      { $limit: paginationArgs.limit },
      { $skip: paginationArgs.offset },
      {
        $lookup: {
          from: "users",
          localField: "members._id",
          foreignField: "_id",
          as: "members._id"
        }
      },
      {
        $project: {
          "_id": 1,
          "name": 1,
          "room_id": 1,
          "members._id": 1,
          "members.role": 1,
          "createdAt": 1,
        }
      }
    ]);

    return chats;
  }

  async findOne(room_id: string): Promise<Chat> {
    const chat = await this.chatModel.aggregate([
      { $match: { "room_id": room_id } },
      {
        $lookup: {
          from: "users",
          localField: "members._id",
          foreignField: "_id",
          as: "members._id"
        }
      },
      {
        $project: {
          "_id": 1,
          "name": 1,
          "room_id": 1,
          "members._id": 1,
          "members.role": 1,
          "createdAt": 1,
        }
      }
    ]);

    if (chat.length === 0) throw new NotFoundException("[chat-not-found]");

    return chat[0];
  }

  async isChatAdmin(user: User, room_id: string): Promise<Chat> {
    const chat = await this.findOne(room_id);

    const userMember = chat.members.find((m) => m._id.toString() === user._id.toString());

    if (userMember === undefined) throw new ForbiddenException();

    if (userMember.role !== memberRoles.admin) throw new ForbiddenException();

    return chat;
  }

  async update(room_id: string, updateChatInput: UpdateChatInput, user: User): Promise<Chat> {
    const chat = await this.isChatAdmin(user, room_id);

    return chat;
  }

  async remove(room_id: string, user: User): Promise<Chat> {
    const chat = await this.isChatAdmin(user, room_id);

    return chat;
  }
}
