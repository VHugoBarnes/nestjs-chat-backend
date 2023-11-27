import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { mongo } from "mongoose";
import { Readable } from "stream";

describe("UsersController", () => {
  let controller: UsersController;

  const mockUsersService = {
    updateProfilePhoto: jest.fn(async () => { return "https://host.com/image.jpg"; })
  };
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should update user's profile picture", async () => {
    const controllerCall = await controller.updateProfilePhoto(mockUser, mockFile);

    expect(controllerCall).toEqual({ url: "https://host.com/image.jpg" });
  });
});
