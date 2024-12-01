import * as fs from "fs";

import { PATHS } from "../configs/constants";
import { DrugDbRepository } from "../interfaces/drug-db-repository";
import { FileHandler } from "../interfaces/file-handler";
import { Logger } from "../interfaces/logger";

export class UpdateDrugDbRecords {
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

  async execute(): Promise<void> {
    try {
      this.logger.info(
        `[UpdateDrugDbRecords.execute] - Listing files from dir: ${PATHS.LOCAL}`
      );

      const files = this.fileHandler.getFiles(PATHS.LOCAL, this.ignoreFiles);
      console.log(files);

      // await this.processFiles(files);
    } catch (err) {
      this.logger.error(
        "[UpdateDrugDbRecords.execute] - Error during execution:",
        err
      );
    } finally {
      await this.drugDbRepository.closeConnection();
      this.logger.info("[UpdateDrugDbRecords.execute] - DB connection ended");
    }
  }

  private async processFiles(files: fs.Dirent[]): Promise<void> {
    for (const file of files) {
      if (file.isDirectory()) continue;

      const filePath = this.fileHandler.resolveFilePath(file);
      const tableName = this.fileHandler.getTableName(file);

      this.logger.info(
        `[UpdateDrugDbRecords.processFiles] - Starting import for table: ${tableName} from file: ${filePath}`
      );

      const fileStream = this.fileHandler.getFileStream(filePath);

      try {
        await this.drugDbRepository.streamToTable(fileStream, tableName);
        this.logger.info(
          `[UpdateDrugDbRecords.processFiles] - Import completed for table: ${tableName}`
        );

        this.fileHandler.deleteFile(filePath);
      } catch (err) {
        this.logger.error(
          `[UpdateDrugDbRecords.processFiles] - Failed to import table: ${tableName}`,
          err
        );
      }
    }
  }
}
