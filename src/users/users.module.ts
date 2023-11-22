import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { User, UserSchema } from "./entities/user.entity";
import { UsersController } from "./users.controller";

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
