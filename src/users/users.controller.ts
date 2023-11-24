import { Controller, Patch, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Patch("profile-photo")
  @UseInterceptors(FileInterceptor("file"))
  updateProfilePhoto(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<object> {

  }
}
