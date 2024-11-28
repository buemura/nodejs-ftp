import { Client, FileInfo, FTPResponse, UploadOptions } from "basic-ftp";
import internal from "stream";

export class FtpProvider {
  private client: Client;

  async connect(): Promise<void> {
    this.client = new Client();
    this.client.ftp.verbose = true;

    try {
      await this.client.access({
        host: process.env.FTP_SERVER_HOST,
        user: process.env.FTP_SERVER_USER,
        password: process.env.FTP_SERVER_PASS,
        secure: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

  disconnect(): void {
    this.client.close();
  }

  async getFileList(path: string): Promise<FileInfo[]> {
    return this.client.list(path);
  }

  async ensureDir(dir: string): Promise<void> {
    await this.client.ensureDir(dir);
  }

  async uploadFile(
    fromPath: internal.Readable | string,
    toRemotePath: string,
    options?: UploadOptions
  ): Promise<void> {
    await this.client.uploadFrom(fromPath, toRemotePath, options);
  }

  async downloadFile(
    destination: internal.Writable | string,
    fromRemotePath: string,
    startAt?: number
  ): Promise<FTPResponse> {
    return this.client.downloadTo(destination, fromRemotePath, startAt);
  }

  async downloadFiles(
    localDirPath: string,
    remoteDirPath?: string
  ): Promise<void> {
    await this.client.downloadToDir(localDirPath, remoteDirPath);
  }
}
