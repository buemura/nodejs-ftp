import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

import { FileHandler } from "../app/interfaces/file-handler";

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

  deleteDir(dirPath: string): void {
    fs.rmSync(dirPath, {
      recursive: true,
      force: true,
    });
  }

  async unzipDirectory(
    inputFilePath: string | Buffer,
    outputDirectory: string
  ): Promise<void> {
    const zip = new AdmZip(inputFilePath);

    return new Promise((resolve, reject) => {
      zip.extractAllToAsync(outputDirectory, true, true, (error: Error) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
