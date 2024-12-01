import * as fs from "fs";
import * as path from "path";

import { FileHandler } from "../interfaces/file-handler";

export class FileHandlerImpl implements FileHandler {
  getFiles(dirPath: string, ignoreFiles: string[]): fs.Dirent[] {
    return fs
      .readdirSync(dirPath, { withFileTypes: true, recursive: true })
      .filter((file) => !ignoreFiles.includes(file.name));
  }

  resolveFilePath(file: fs.Dirent): string {
    return path.resolve(file.parentPath, file.name);
  }

  getTableName(file: fs.Dirent): string {
    return path.basename(file.name, path.extname(file.name));
  }

  getFileStream(filePath: string): fs.ReadStream {
    return fs.createReadStream(filePath);
  }

  deleteFile(filePath: string): void {
    fs.unlinkSync(filePath);
  }
}
