import { IsString, MinLength } from "class-validator";

export class NewMessageDto {
  @IsString()
  room_id: string;

  @IsString()
  @MinLength(1)
  content: string;
};