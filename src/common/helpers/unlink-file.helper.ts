import { unlink } from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(unlink);

export const unlinkFile = async (filePath: string) => {
  try {
    if (process.env.NODE_ENV === "test") return;
    await unlinkAsync(filePath);
  } catch (error) {
    console.error(error);
  }
};