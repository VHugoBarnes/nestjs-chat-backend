import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsConfig = (): CorsOptions => {
  if (process.env.PROJECT_ENV) {
    return {
      origin: ["http://localhost:3000"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    };
  }

  return {
    origin: [""],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };
};