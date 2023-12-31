import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";

import * as bcrypt from "bcrypt";

import { RegisterDto } from "../auth/dto";
import { User } from "./entities/user.entity";
import { UpdateUserInput } from "./dto/inputs/updateUser.input";
import { CloudinaryStrategy } from "../common/file-upload/cloudinary.strategy";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { SearchArgs } from "src/common/dto/args/search.args";
import { ObjectId } from "src/common/types";

@Injectable()
export class UsersService {
  private logger = new Logger("UserService");

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly cloudinaryStrategy: CloudinaryStrategy
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

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<User[]> {
    const users = await this.userModel.aggregate([
      {
        $match: {
          name: {
            $regex: searchArgs.search,
            $options: "i"
          },
        }
      },
      { $limit: paginationArgs.limit },
      { $skip: paginationArgs.offset },
      {
        $project: {
          "name": 1,
          "username": 1,
          "email": 1,
          "profilePhoto": 1,
        }
      }
    ]);

    return users;
  }

  async findInBatch(ids: ObjectId[]): Promise<User[]> {
    const users = await this.userModel.find({ _id: { $in: ids } });

    return users;
  }

  async update(_id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate<User>(_id, updateUserInput, { new: true });

    return updatedUser;
  }

  async updateProfilePhoto(user: User, file: Express.Multer.File): Promise<string> {
    //TODO: Delete previous image
    //? Upload image to cloudinary
    const result = await this.cloudinaryStrategy.uploadFile(file);
    const url = result.secure_url;

    await this.userModel.findByIdAndUpdate(user._id, { $set: { profilePhoto: url } });

    return url;
  }

  private handleDBErrors = (error: any) => {
    if (error.code === 11000) {
      throw new ForbiddenException("[email-username-already-exists]");
    }

    this.logger.error(error.code);
    this.logger.error(error);
  };
}
