import fs from "fs";

import { PATHS } from "../../configs/constants";
import { DrugDbRepository } from "../interfaces/drug-db-repository";
import { FileHandler } from "../interfaces/file-handler";
import { Logger } from "../interfaces/logger";

export class DataService {
  private readonly ignoreFiles = [
    ".gitkeep",
    "Copyright.txt",
    "UPDATE_INFO.UPD",
  ];

  constructor(
    private logger: Logger,
    private fileHandler: FileHandler,
    private drugDbRepository: DrugDbRepository
  ) {}

  async updateRecords(): Promise<void> {
    this.logger.info(
      `[DataService.updateRecords] - Listing files from dir: ${PATHS.LOCAL}`
    );

    const files = this.fileHandler.getFiles(PATHS.LOCAL, this.ignoreFiles);
    await this.processFiles(files);

    await this.drugDbRepository.closeConnection();
    this.logger.info("[DataService.updateRecords] - DB connection ended");
  }

  async truncateTables(): Promise<void> {
    this.logger.info(`[DataService.truncateTables] - Truncating tables`);
    await this.drugDbRepository.executeQueryFromFile(PATHS.QUERY.TRUNCATE);
    this.logger.info(`[DataService.truncateTables] - Tables truncated`);
  }

  private async processFiles(files: fs.Dirent[]): Promise<void> {
    for (const file of files) {
      if (file.isDirectory()) continue;

      const filePath = this.fileHandler.resolveFilePath(file);
      const tableName = this.fileHandler.getTableName(file);

      this.logger.info(
        `[DataService.processFiles] - Starting import for table: ${tableName} from file: ${filePath}`
      );

      const fileStream = this.fileHandler.getFileStream(filePath);

      await this.drugDbRepository.streamToTable(fileStream, tableName);
      this.logger.info(
        `[DataService.processFiles] - Import completed for table: ${tableName}`
      );
    }
  }
}
