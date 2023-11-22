import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";

import * as bcrypt from "bcrypt";

import { RegisterDto } from "../auth/dto";
import { User } from "./entities/user.entity";
import { UpdateUserInput } from "./dto/inputs/updateUser.input";

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

      const user = await this.userModel.create({ ...registerDto, password: encryptedPwd, _id: new mongo.ObjectId() });

      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });

    if (!user) throw new NotFoundException("[user-not-found]");

    return user;
  }

  async findById(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id);

    if (!user) throw new NotFoundException("[user-not-found]");

    return user;
  }

  async update(updateUserInput: UpdateUserInput): Promise<User> {
    return await this.findById(updateUserInput._id);
  }

  private handleDBErrors = (error: any) => {
    if (error.code === 11000) {
      throw new ForbiddenException("[email-username-already-exists]");
    }

    this.logger.error(error.code);
    this.logger.error(error);
  };
}
