import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { UpdateUserInput } from "./dto/inputs/updateUser.input";
import { Auth } from "src/auth/decorators/auth.decorator";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => User, { name: "updateUser" })
  @Auth()
  async updateUser(
    @Args("updateUserInput") updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(updateUserInput);
  }

  @Query(() => User, { name: "user" })
  async getUser(
    @Args("id") userId: string
  ): Promise<User> {
    return this.usersService.findById(userId);
  }
}
