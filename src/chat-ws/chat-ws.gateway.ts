import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { ChatWsService } from "./chat-ws.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { Logger } from "@nestjs/common";

@WebSocketGateway({ cors: true, namespace: "chat" })
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  logger = new Logger("ChatGateway");

  constructor(
    private readonly chatWsService: ChatWsService,
    private readonly jwtService: JwtService,
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    const roomId = client.handshake.headers.room_id as string;

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      //? Check if user belongs to chatroom
      await this.chatWsService.userCanJoinRoom(payload._id, roomId);

      // this.chatWsService.userCanJoinRoom(payload._id, )
    } catch (error) {
      this.logger.error(error);
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
  }

  @SubscribeMessage("message-from-client")
  create(@MessageBody() payload: any) {
    console.log({ payload });
    this.wss.emit("message-from-server", { data: "world" });

    // this.wss.to();
    // return this.chatWsService.create(createChatWDto);
  }
}
