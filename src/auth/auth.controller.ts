import { Body, Controller, Get, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { LoginDto, RegisterDto } from "./dto";
import { Auth } from "./decorators/auth.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get("test")
  @Auth()
  test() {
    return "pass";
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
