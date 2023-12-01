import { Injectable } from "@nestjs/common";
import { NewMessageDto } from "./dto";
import { ObjectId } from "src/common/types";

@Injectable()
export class ChatMessagesService {
  async addMessage(newMessageDto: NewMessageDto, files?: Express.Multer.File[]) { }

  async getLastMessage(room_id: ObjectId) { }

  async getMessages() { }
}
