import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

import helmet from "helmet";

import { AppModule } from "./app.module";
import { corsConfig, helmetConfig, swaggerDocument } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig());
  app.use(helmet(helmetConfig));

  //? Swagger config
  SwaggerModule.setup("docs", app, swaggerDocument(app));

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
