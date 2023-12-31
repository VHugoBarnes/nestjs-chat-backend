type cbType = (error: Error, acceptFile: boolean) => void;

export const imageFileFilter = (req: Express.Request, file: Express.Multer.File, cb: cbType) => {
  if (!file) return cb(new Error("File is empty"), false);

  const fileExtension = file.mimetype.split("/")[1];
  const validExtensions = ["jpg", "jpeg", "png", "gif"];

  if (validExtensions.includes(fileExtension)) {
    return cb(null, true);
  }

  cb(null, false);
};