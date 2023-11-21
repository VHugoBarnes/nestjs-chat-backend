import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { RegisterDto } from "./dto";
import { UsersService } from "src/users/users.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.create(registerDto);
  }
}
