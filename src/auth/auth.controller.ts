import { Body, Controller, Get, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { LoginDto, RegisterDto } from "./dto";
import { AuthHttp } from "./decorators/auth-http.decorator";
import { GetJwt } from "./decorators/get-jwt.decorator";
// import { Auth } from "./decorators/auth.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get("renew-token")
  @AuthHttp()
  async renew(
    @GetJwt() jwt: string
  ) {
    return this.authService.renewToken(jwt);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
