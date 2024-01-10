import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const swaggerConfig = new DocumentBuilder()
  .setTitle("Chat websockets")
  .setDescription("Example of a chat server using RESTful APIs, GraphQL and WebSockets.")
  .setVersion("1.0")
  .build();

export const swaggerDocument = (app: INestApplication<any>) => {
  return SwaggerModule.createDocument(app, swaggerConfig);
};