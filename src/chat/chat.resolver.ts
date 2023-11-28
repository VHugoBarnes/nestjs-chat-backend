import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { ChatService } from "./chat.service";
import { Chat } from "./entities/chat.entity";
import { CreateChatInput } from "./dto/create-chat.input";
import { UpdateChatInput } from "./dto/update-chat.input";
import { AuthGql } from "src/auth/decorators/auth-gql.decorator";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/users/entities/user.entity";

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
  findAll() {
    return this.chatService.findAll();
  }

  @Query(() => Chat, { name: "chat" })
  findOne(@Args("id", { type: () => ID }) id: string) {
    return this.chatService.findOne(id);
  }

  @Mutation(() => Chat)
  updateChat(@Args("updateChatInput") updateChatInput: UpdateChatInput) {
    return this.chatService.update(updateChatInput._id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args("id", { type: () => ID }) id: string) {
    return this.chatService.remove(id);
  }
}
