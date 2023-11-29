import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { ChatService } from "./chat.service";
import { Chat } from "./entities/chat.entity";
import { CreateChatInput } from "./dto/create-chat.input";
import { UpdateChatInput } from "./dto/update-chat.input";
import { AuthGql } from "src/auth/decorators/auth-gql.decorator";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/users/entities/user.entity";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { SearchArgs } from "src/common/dto/args/search.args";

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) { }

  @Mutation(() => Chat)
  @AuthGql()
  createChat(
    @Args("createChatInput") createChatInput: CreateChatInput,
    @CurrentUser() user: User
  ) {
    return this.chatService.create(createChatInput, user);
  }

  @Query(() => [Chat], { name: "chat" })
  @AuthGql()
  findAll(
    @CurrentUser() user: User,
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
