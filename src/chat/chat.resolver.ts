import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { ChatService } from "./chat.service";
import { Chat } from "./entities/chat.entity";
import { CreateChatInput, UpdateChatInput } from "./dto";

import { AuthGql } from "../auth/decorators/auth-gql.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { PaginationArgs } from "../common/dto/args/pagination.args";
import { SearchArgs } from "../common/dto/args/search.args";
import { ContextType } from "../common/enums/context-type.enum";

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) { }

  @Mutation(() => Chat, { name: "createChat" })
  @AuthGql()
  async createChat(
    @Args("createChatInput") createChatInput: CreateChatInput,
    @CurrentUser(ContextType.graphql) user: User
  ): Promise<Chat> {
    return this.chatService.create(createChatInput, user);
  }

  @Query(() => [Chat], { name: "chats" })
  @AuthGql()
  async findAll(
    @CurrentUser(ContextType.graphql) user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ) {
    return this.chatService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => Chat, { name: "chat" })
  @AuthGql()
  async findOne(
    @Args("id", { type: () => ID }) id: string,
    @CurrentUser(ContextType.graphql) user: User
  ) {
    return this.chatService.findOne(id, user);
  }

  @Mutation(() => Chat, { name: "updateChat" })
  @AuthGql()
  async updateChat(
    @Args("updateChatInput") updateChatInput: UpdateChatInput,
    @CurrentUser(ContextType.graphql) user: User
  ) {
    return this.chatService.update(updateChatInput.room_id, updateChatInput, user);
  }

  @Mutation(() => Chat, { name: "removeChat" })
  @AuthGql()
  async removeChat(
    @Args("room_id", { type: () => String }) room_id: string,
    @CurrentUser(ContextType.graphql) user: User
  ) {
    return this.chatService.remove(room_id, user);
  }
}
