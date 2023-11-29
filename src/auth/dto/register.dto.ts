import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;
};