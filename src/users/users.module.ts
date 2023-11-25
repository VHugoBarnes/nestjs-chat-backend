import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { User, UserSchema } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { CloudinaryStrategy } from "src/common/file-upload/cloudinary.strategy";
import { ConfigModule } from "@nestjs/config";

@Module({
  providers: [
    UsersResolver,
    UsersService,
    CloudinaryStrategy
  ],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
  ],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
