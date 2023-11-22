import { Test, TestingModule } from "@nestjs/testing";
import { ChatMessagesResolver } from "./chat-messages.resolver";
import { ChatMessagesService } from "./chat-messages.service";

describe("ChatMessagesResolver", () => {
  let resolver: ChatMessagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMessagesResolver, ChatMessagesService],
    }).compile();

    resolver = module.get<ChatMessagesResolver>(ChatMessagesResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
