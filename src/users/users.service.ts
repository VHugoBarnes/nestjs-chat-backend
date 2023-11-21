import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import * as bcrypt from "bcrypt";

import { LoginDto, RegisterDto } from "../auth/dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  private logger = new Logger("UserService");

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async create(registerDto: RegisterDto): Promise<User> {
    try {
      // encrypt password
      const encryptedPwd = await bcrypt.hash(registerDto.password, 10);

      const user = await this.userModel.create({ ...registerDto, password: encryptedPwd });

      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginDto: LoginDto) {
    console.log({ loginDto });
  }

  private handleDBErrors = (error: any) => {
    this.logger.error(typeof error);
    this.logger.error(error);
  };
}
