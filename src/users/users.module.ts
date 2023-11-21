import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { User, UserSchema } from "./entities/user.entity";

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  exports: [UsersService]
})
export class UsersModule { }
