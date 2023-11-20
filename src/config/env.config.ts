import * as Joi from "joi";

export const EnvConfiguration = () => ({
  mongoUrl: process.env.MONGO_URL,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET
});

export const JoiValidationSchema = Joi.object({
  MONGO_URL: Joi.required(),
  PORT: Joi.number().required(),
  JWT_SECRET: Joi.string().required()
});