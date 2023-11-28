import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { UpdateUserInput } from "./dto/inputs/updateUser.input";
import { AuthGql } from "../auth/decorators/auth-gql.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ContextType } from "../common/enums/context-type.enum";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => User, { name: "updateUser" })
  @AuthGql()
  async updateUser(
    @CurrentUser(ContextType.graphql) user: User,
    @Args("updateUserInput") updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(user._id, updateUserInput);
  }

  @Query(() => User, { name: "user" })
  async getUser(
    @Args("id") userId: string
  ): Promise<User> {
    return this.usersService.findById(userId);
  }

  @Query(() => User, { name: "currentUser" })
  @AuthGql()
  async getCurrentUser(
    @CurrentUser(ContextType.graphql) user: User
  ): Promise<User> {
    return user;
  }
}
