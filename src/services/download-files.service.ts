import { PATHS } from "../configs/constants";
import { FtpProvider } from "../interfaces/ftp-provider";
import { Logger } from "../interfaces/logger";

export class DownloadFileService {
  constructor(
    private readonly logger: Logger,
    private readonly ftpProvider: FtpProvider
  ) {}

  async execute(): Promise<void> {
    try {
      await this.ftpProvider.connect();

      this.logger.info(
        `[DownloadFileService.execute] - Downloading files from ${PATHS.basePath} to ${PATHS.tempPath}`
      );

      await this.ftpProvider.downloadFiles(PATHS.tempPath, PATHS.basePath);

      this.logger.info(
        "[DownloadFileService.execute] - Files downloaded successfully"
      );
    } catch (error) {
      this.logger.error(
        "[DownloadFileService.execute] - Error downloading files:",
        error
      );
    } finally {
      this.ftpProvider.disconnect();
      this.logger.info(
        "[DownloadFileService.execute] - Disconnected from FTP server"
      );
    }
  }
}
