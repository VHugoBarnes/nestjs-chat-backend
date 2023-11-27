import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";

import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { RegisterDto } from "./dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    delete user.password;

    return {
      user: user,
      token: this.getJwtToken({ _id: user._id })
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    // verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException("[unauthorized]");

    const token = this.getJwtToken({ _id: user._id });

    return {
      token: token,
      user: { name: user.name, email: user.email, username: user.username }
    };
  }

  renewToken(token: string) {
    try {
      const { _id } = this.jwtService.verify<JwtPayload>(token, { secret: this.configService.get("jwtSecret") });

      const newToken = this.getJwtToken({ _id: _id });

      return { token: newToken };
    } catch (error) {
      throw new ForbiddenException("[invalid-jwt]");
    }
  }
}
