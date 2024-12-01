import "dotenv/config";

import { DataService } from "./src/app/services/data-service";
import { FileHandlerService } from "./src/app/services/file-handler-service";
import { PgDrugDbRepository } from "./src/infra/database";
import { FileHandlerImpl } from "./src/infra/file-handler";
import { BasicFtpProvider } from "./src/infra/ftp";
import { LoggerImpl } from "./src/infra/logger";

async function init(): Promise<void> {
  try {
    console.log("==> starting updateDatabaseFunction <===");

    const logger = new LoggerImpl();
    const ftpProvider = new BasicFtpProvider();
    const fileHandler = new FileHandlerImpl();
    const drugDbRepository = new PgDrugDbRepository();

    const fileHandlerService = new FileHandlerService(
      logger,
      ftpProvider,
      fileHandler
    );
    const dataService = new DataService(logger, fileHandler, drugDbRepository);

    await fileHandlerService.downloadRemoteFiles();
    await fileHandlerService.unzipDirectories();
    await dataService.truncateTables();
    // await dataService.updateRecords();
    fileHandlerService.cleanUpTempDir();
  } catch (error) {
    console.error(error.message);
  }
}

init();
