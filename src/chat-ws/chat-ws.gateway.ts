import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { ChatWsService } from "./chat-ws.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { Logger } from "@nestjs/common";
import { NewChatMessageDto } from "./dto/new-chat-message.dto";
import { ChatMessagesService } from "src/chat-messages/chat-messages.service";
import { UsersService } from "src/users/users.service";

@WebSocketGateway({ cors: true, namespace: "chat" })
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  logger = new Logger("ChatGateway");

  constructor(
    private readonly chatWsService: ChatWsService,
    private readonly chatMessagesService: ChatMessagesService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    const roomId = client.handshake.headers.room_id as string;

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      //? Check if user belongs to chatroom
      await this.chatWsService.userCanJoinRoom(payload._id, roomId);

      client.join(roomId);
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
  async create(@ConnectedSocket() client: Socket, @MessageBody() newChatMessageDto: NewChatMessageDto) {
    const token = client.handshake.headers.authentication as string;
    const roomId = client.handshake.headers.room_id as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload._id);
      const message = await this.chatMessagesService.addMessage({ content: newChatMessageDto.content, room_id: roomId }, user);

      this.wss.to(roomId).emit("message-from-server", message);
    } catch (error) {
      this.logger.error(error);
      client.disconnect();
      return;
    }
  }
}
