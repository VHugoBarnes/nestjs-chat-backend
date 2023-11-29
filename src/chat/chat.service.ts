import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";
import { nanoid } from "nanoid";

import { Chat, Member, memberRoles } from "./entities/chat.entity";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { CreateChatInput, UpdateChatInput } from "./dto";
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
    if (createChatInput.members.every((m) => m._id.toString() !== user._id.toString()) === false) {
      throw new ForbiddenException();
    }

    // Create room_id
    const roomId = nanoid();

    // Convert string _id to ObjectId string
    const sanitizedMembers = createChatInput.members.map(member => ({ ...member, _id: new mongo.ObjectId(member._id) }));

    const members = [...sanitizedMembers, { _id: user._id, role: memberRoles.admin }];

    // Create chat
    const chat = await this.chatModel.create({
      name: createChatInput.name,
      _id: new mongo.ObjectId(),
      members: members,
      room_id: roomId
    });

    return this.findOne(chat.room_id, user);
  }

  // find chats where user is part of
  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Chat[]> {
    const chats = await this.chatModel.aggregate([
      {
        $match: {
          name: {
            $regex: searchArgs.search,
            $options: "i"
          },
        }
      },
      {
        $match: {
          "members._id": user._id
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
          as: "members_users"
        }
      },
      {
        $project: {
          "_id": 1,
          "name": 1,
          "room_id": 1,
          "createdAt": 1,
          "updatedAt": 1,
          "members": {
            $map: {
              input: "$members_users",
              as: "memberUser",
              in: {
                _id: {
                  _id: "$$memberUser._id",
                  name: "$$memberUser.name",
                  username: "$$memberUser.username",
                  email: "$$memberUser.email",
                  profilePhoto: { $ifNull: ["$$memberUser.profilePhoto", null] }
                },
                role: {
                  $arrayElemAt: [
                    "$members.role",
                    {
                      $indexOfArray: ["$members._id._id", "$$memberUser._id"]
                    }
                  ]
                }
              }
            }
          }
        }
      }
    ]);

    return chats;
  }

  async findOne(room_id: string, user: User): Promise<Chat> {
    const chat = await this.chatModel.aggregate([
      { $match: { "room_id": room_id } },
      {
        $match: {
          "members._id": user._id
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "members._id",
          foreignField: "_id",
          as: "members_users"
        }
      },
      {
        $project: {
          "_id": 1,
          "name": 1,
          "room_id": 1,
          "createdAt": 1,
          "updatedAt": 1,
          "members": {
            $map: {
              input: "$members_users",
              as: "memberUser",
              in: {
                _id: {
                  _id: "$$memberUser._id",
                  name: "$$memberUser.name",
                  username: "$$memberUser.username",
                  email: "$$memberUser.email",
                  profilePhoto: { $ifNull: ["$$memberUser.profilePhoto", null] }
                },
                role: {
                  $arrayElemAt: [
                    "$members.role",
                    {
                      $indexOfArray: ["$members._id._id", "$$memberUser._id"]
                    }
                  ]
                }
              }
            }
          }
        }
      }
    ]);
    if (chat.length === 0) throw new NotFoundException("[chat-not-found]");

    return chat[0];
  }

  async isChatAdmin(user: User, room_id: string): Promise<Chat> {
    const chat = await this.findOne(room_id, user);

    const userMember = chat.members.find((m) => m._id._id.toString() === user._id.toString());

    if (userMember === undefined) throw new ForbiddenException("[user-not-member]");

    if (userMember.role !== memberRoles.admin) throw new ForbiddenException("[user-not-admin]");

    return chat;
  }

  async update(room_id: string, updateChatInput: UpdateChatInput, user: User): Promise<Chat> {
    const chat = await this.isChatAdmin(user, room_id);

    // update name
    if (updateChatInput.name) {
      await this.chatModel.findByIdAndUpdate(chat._id, { $set: { name: updateChatInput.name } });
    }

    // update members
    if (updateChatInput.members) {
      const oldMembers: Member[] = chat.members;
      const ownMember: Member = oldMembers.find((m) => m._id._id.toString() === user._id.toString());

      // build new members with admin
      const newMembers: Member[] = updateChatInput.members.map((member: Member) => ({ ...member, _id: new mongo.ObjectId(member._id) }));
      newMembers.push({ ...ownMember, _id: ownMember._id._id }); // push admin

      await this.chatModel.findByIdAndUpdate(chat._id, { $set: { members: newMembers } });
    }

    return this.findOne(chat.room_id, user);
  }

  async remove(room_id: string, user: User): Promise<Chat> {
    const chat = await this.isChatAdmin(user, room_id);

    await this.chatModel.findByIdAndDelete(chat._id);

    // TODO: Remove messages
    // TODO: Or just mark chat as deleted without deleting it

    return chat;
  }
}
