import { join } from "path";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { JwtService } from "@nestjs/jwt";

import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { ChatWsModule } from "./chat-ws/chat-ws.module";
import { CommonModule } from "./common/common.module";
import { ChatMessagesModule } from "./chat-messages/chat-messages.module";

import { EnvConfiguration, JoiValidationSchema } from "./config/env.config";

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
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule, ConfigModule],
      inject: [JwtService, ConfigService],
      useFactory: async (jwtService: JwtService, configService: ConfigService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        includeStacktraceInErrorResponses: false,
        plugins: [
          ApolloServerPluginLandingPageLocalDefault()
        ],
        async context({ req }) {
          const token = req.headers.authorization?.replace("Bearer ", "");
          if (!token) throw Error("[token-needed]");

          try {
            const payload = await jwtService.verify(token, { secret: configService.get("jwtSecret") });
            if (!payload) throw Error("[forbidden]");
          } catch (error) {
            throw new Error("[forbidden]");
          }
        }
      })
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
