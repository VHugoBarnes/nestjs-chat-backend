import { ConfigService } from "@nestjs/config";
import { IFileUpload } from "./file-upload.interface";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class CloudinaryStrategy implements IFileUpload<UploadApiResponse> {
  private logger = new Logger("CloudinaryStrategy");

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>("cloudinary_cloud_name"),
      api_key: configService.get<string>("cloudinary_api_key"),
      api_secret: configService.get<string>("cloudinary_api_secret")
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    try {
      delete file.buffer;
      delete file.stream;
      this.logger.debug(JSON.stringify(file));
      const result = await cloudinary.uploader.upload(file.path, {});

      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
};