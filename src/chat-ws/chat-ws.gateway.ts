import { WebSocketGateway, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { ChatWsService } from "./chat-ws.service";

@WebSocketGateway({ cors: true })
export class ChatWsGateway {
  constructor(private readonly chatWsService: ChatWsService) { }

  @SubscribeMessage("createChatW")
  create(@MessageBody() createChatWDto: any) {
    console.log(createChatWDto);
    // return this.chatWsService.create(createChatWDto);
  }
}
