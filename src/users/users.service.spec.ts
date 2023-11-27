import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { CloudinaryStrategy } from "../common/file-upload/cloudinary.strategy";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "./entities/user.entity";
import { UploadApiResponse } from "cloudinary";
import { mongo } from "mongoose";
import { Readable } from "stream";

describe("UsersService", () => {
  let service: UsersService;

  const mockUser = {
    _id: new mongo.ObjectId().toString(),
    email: "test@mail.com",
    name: "Testing user",
    username: "test",
    password: "",
    profilePhoto: ""
  };
  const mockFile: Express.Multer.File = {
    fieldname: "file",
    originalname: "test.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    destination: "temp/",
    filename: "test.jpg",
    path: "temp/test.jpg",
    size: 1024,
    stream: new Readable({
      read() {
        this.push(null); // Pushing null to signify end of data
      }
    }),
    buffer: Buffer.from("")
  };

  const mockCloudinaryStrategy = {
    uploadFile: jest.fn(async (file: Express.Multer.File): Promise<UploadApiResponse> => ({
      public_id: "cr4mxeqx5zb8rlakpfkg",
      version: 1571218330,
      signature: "63bfbca643baa9c86b7d2921d776628ac83a1b6e",
      width: 864,
      height: 576,
      format: "jpg",
      resource_type: "image",
      created_at: "2017-06-26T19:46:03Z",
      bytes: 120253,
      type: "upload",
      url: "http://res.cloudinary.com/demo/image/upload/v1571218330/cr4mxeqx5zb8rlakpfkg.jpg",
      secure_url: "https://res.cloudinary.com/demo/image/upload/v1571218330/cr4mxeqx5zb8rlakpfkg.jpg",
      access_control: [],
      access_mode: "",
      context: {},
      etag: "",
      metadata: {},
      moderation: [],
      original_filename: file.originalname,
      pages: 0,
      placeholder: true,
      tags: [],
    }))
  };
  const mockUserSchema = {
    findByIdAndUpdate: jest.fn(async () => { }),
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
            useValue: mockUserSchema
          }
        ],
      })
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should update user's profile photo", async () => {
    const serviceCall = await service.updateProfilePhoto(mockUser, mockFile);

    expect(serviceCall).toBe("https://res.cloudinary.com/demo/image/upload/v1571218330/cr4mxeqx5zb8rlakpfkg.jpg");
  });
});
