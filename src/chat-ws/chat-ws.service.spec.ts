import { Test, TestingModule } from "@nestjs/testing";
import { ChatWsService } from "./chat-ws.service";

describe("ChatWsService", () => {
  let service: ChatWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatWsService],
    }).compile();

    service = module.get<ChatWsService>(ChatWsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
