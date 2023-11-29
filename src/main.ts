import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //? Swagger config
  const config = new DocumentBuilder()
    .setTitle("Chat websockets")
    .setDescription("Example of a chat server using RESTful APIs, GraphQL and WebSockets.")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  //? Global pipes config (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove everything that is not in the DTOs
      // forbidNonWhitelisted: true, // return a bad request if there are unwanted properties
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
