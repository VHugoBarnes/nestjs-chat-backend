import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { ChatWsModule } from "./chat-ws/chat-ws.module";
import { CommonModule } from "./common/common.module";

import { EnvConfiguration, JoiValidationSchema } from "./config/env.config";
import { ChatMessagesModule } from './chat-messages/chat-messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("mongoUrl"),
      }),
    }),
    CommonModule,
    UsersModule,
    AuthModule,
    ChatModule,
    ChatWsModule,
    ChatMessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
