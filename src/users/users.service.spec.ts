import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { CloudinaryStrategy } from "../common/file-upload/cloudinary.strategy";
import { getModelToken } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/user.entity";

describe("UsersService", () => {
  let service: UsersService;

  const mockCloudinaryStrategy = {
    uploadFile: async () => { }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test
      .createTestingModule({
        providers: [
          UsersService,
          {
            provide: CloudinaryStrategy,
            useValue: mockCloudinaryStrategy
          },
          {
            provide: getModelToken(User.name),
            useValue: UserSchema
          }
        ],
      })
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
