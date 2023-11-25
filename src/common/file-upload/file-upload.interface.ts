export interface IFileUpload<T> {
  uploadFile(file: Express.Multer.File): Promise<T>;
}