import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { ChatService } from "./chat.service";
import { Chat } from "./entities/chat.entity";
import { CreateChatInput } from "./dto/create-chat.input";
import { UpdateChatInput } from "./dto/update-chat.input";

import { AuthGql } from "../auth/decorators/auth-gql.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { PaginationArgs } from "../common/dto/args/pagination.args";
import { SearchArgs } from "../common/dto/args/search.args";
import { ContextType } from "../common/enums/context-type.enum";

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) { }

  @Mutation(() => Chat)
  @AuthGql()
  createChat(
    @Args("createChatInput") createChatInput: CreateChatInput,
    @CurrentUser(ContextType.graphql) user: User
  ): Promise<Chat> {
    return this.chatService.create(createChatInput, user);
  }

  @Query(() => [Chat], { name: "chat" })
  @AuthGql()
  findAll(
    @CurrentUser(ContextType.graphql) user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ) {
    return this.chatService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => Chat, { name: "chat" })
  @AuthGql()
  findOne(@Args("id", { type: () => ID }) id: string) {
    return this.chatService.findOne(id);
  }

  @Mutation(() => Chat)
  @AuthGql()
  updateChat(
    @Args("updateChatInput") updateChatInput: UpdateChatInput,
    @CurrentUser() user: User
  ) {
    return this.chatService.update(updateChatInput._id, updateChatInput, user);
  }

  @Mutation(() => Chat)
  @AuthGql()
  removeChat(
    @Args("id", { type: () => ID }) id: string,
    @CurrentUser() user: User
  ) {
    return this.chatService.remove(id, user);
  }
}
