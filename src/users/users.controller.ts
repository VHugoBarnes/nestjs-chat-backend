import { Controller, Logger, Patch, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthHttp } from "../auth/decorators/auth-http.decorator";
import { imageFileFilter } from "../common/helpers/image-file-filter.helper";

import { unlinkFile } from "../common/helpers/unlink-file.helper";

@Controller("users")
export class UsersController {
  private logger = new Logger("UsersController");

  constructor(
    private readonly usersService: UsersService,
  ) { }

  @AuthHttp()
  @Patch("profile-photo")
  @UseInterceptors(
    FileInterceptor(
      "file",
      {
        limits: { files: 8 * 1024 * 1024 },
        fileFilter: imageFileFilter,
        dest: "temp/"
      }
    ),
  )
  async updateProfilePhoto(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<object> {
    const url = await this.usersService.updateProfilePhoto(user, file);

    // Delete the file after processing
    await unlinkFile(file.path);

    return { url };
  }
}
