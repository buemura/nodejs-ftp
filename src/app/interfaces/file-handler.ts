import fs from "fs";

export interface FileHandler {
  getFiles(dirPath: string, ignoreFiles: string[]): fs.Dirent[];
  resolveFilePath(file: fs.Dirent): string;
  getTableName(file: fs.Dirent): string;
  getFileStream(filePath: string): fs.ReadStream;
  deleteFile(filePath: string): void;
  deleteDir(dirPath: string): void;
  unzipDirectory(
    inputFilePath: string | Buffer,
    outputDirectory: string
  ): Promise<void>;
}
