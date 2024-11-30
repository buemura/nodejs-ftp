export interface FtpProvider {
  connect(): void | Promise<void>;
  disconnect(): void | Promise<void>;
  ensureDir(dir: string): Promise<void>;
  downloadFiles(localPath: string, remotePath: string): void | Promise<void>;
}
