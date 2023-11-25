import * as Joi from "joi";

export const EnvConfiguration = () => ({
  mongoUrl: process.env.MONGO_URL,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const JoiValidationSchema = Joi.object({
  MONGO_URL: Joi.required(),
  PORT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
});