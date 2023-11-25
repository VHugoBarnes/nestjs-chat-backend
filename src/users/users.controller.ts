import { Controller, InternalServerErrorException, Logger, Patch, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthHttp } from "src/auth/decorators/auth-http.decorator";
import { fileFilter } from "src/common/helpers/file-filter.helper";

import { unlink } from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(unlink);

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
        fileFilter: fileFilter,
        dest: "temp/"
      }
    ),
  )
  async updateProfilePhoto(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<object> {
    try {
      const url = await this.usersService.updateProfilePhoto(user, file);

      // Delete the file after processing
      await unlinkAsync(file.path);

      return { url };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException("[server-error]");
    }
  }
}
