import { Client } from "basic-ftp";

import { env } from "../configs/env";
import { FtpProvider } from "../app/interfaces/ftp-provider";

export class BasicFtpProvider implements FtpProvider {
  private client: Client;

  constructor() {
    this.client = new Client();
  }

  async connect(): Promise<void> {
    try {
      await this.client.access({
        host: env.FTP_SERVER_HOST,
        user: env.FTP_SERVER_USER,
        password: env.FTP_SERVER_PASS,
        secure: false,
      });
    } catch (error) {
      throw new Error(`Failed to connect to FTP server: ${error.message}`);
    }
  }

  disconnect(): void {
    this.client.close();
  }

  async ensureDir(dir: string): Promise<void> {
    await this.client.ensureDir(dir);
  }

  async downloadFiles(localPath: string, remotePath: string): Promise<void> {
    try {
      await this.client.downloadToDir(localPath, remotePath);
    } catch (error) {
      throw new Error(`Failed to download files: ${error.message}`);
    }
  }
}
