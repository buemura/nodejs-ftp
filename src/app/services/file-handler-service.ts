import { PATHS } from "../../configs/constants";
import { FileHandler } from "../interfaces/file-handler";
import { FtpProvider } from "../interfaces/ftp-provider";
import { Logger } from "../interfaces/logger";

export class FileHandlerService {
  constructor(
    private readonly logger: Logger,
    private readonly ftpProvider: FtpProvider,
    private readonly fileHandler: FileHandler
  ) {}

  cleanUpTempDir(): void {
    this.logger.info(
      `[FileHandlerService.cleanUpTempDir] - Cleaning up temp directory ${PATHS.LOCAL}`
    );
    this.fileHandler.deleteDir(PATHS.LOCAL);
    this.logger.info(
      `[FileHandlerService.cleanUpTempDir] - Cleaning up finished`
    );
  }

  async downloadRemoteFiles(): Promise<void> {
    await this.ftpProvider.connect();

    this.logger.info(
      `[FileHandlerService.downloadRemoteFiles] - Downloading files from ${PATHS.REMOTE_CURRENT} to ${PATHS.LOCAL}`
    );

    await this.ftpProvider.downloadFiles(PATHS.LOCAL, PATHS.REMOTE_CURRENT);

    this.logger.info(
      "[FileHandlerService.downloadRemoteFiles] - Files downloaded successfully"
    );

    this.ftpProvider.disconnect();
    this.logger.info(
      "[FileHandlerService.downloadRemoteFiles] - Disconnected from FTP server"
    );
  }

  async unzipDirectories(): Promise<void> {
    this.logger.info(
      `[DataService.unzipDirectories] - Listing files from dir: ${PATHS.LOCAL}`
    );

    const files = this.fileHandler
      .getFiles(PATHS.LOCAL, [])
      .filter((f) => f.name.includes(".zip"));

    for (const file of files) {
      await this.fileHandler.unzipDirectory(
        `${file.parentPath}/${file.name}`,
        PATHS.LOCAL
      );
    }
  }
}
