import "dotenv/config";

import { PgDrugDbRepository } from "../infra/database";
import { FileHandlerImpl } from "../infra/file-handler";
import { BasicFtpProvider } from "../infra/ftp";
import { LoggerImpl } from "../infra/logger";
import { DownloadFileService } from "../services/download-files.service";
import { UpdateDrugDbRecords } from "../services/update-record.service";

async function init() {
  const logger = new LoggerImpl();
  const ftpProvider = new BasicFtpProvider();
  const fileHandler = new FileHandlerImpl();
  const drugDbRepository = new PgDrugDbRepository();

  const downloadFileService = new DownloadFileService(logger, ftpProvider);
  const updateDrugDbRecords = new UpdateDrugDbRecords(
    logger,
    fileHandler,
    drugDbRepository
  );

  await downloadFileService.execute();
  await updateDrugDbRecords.execute();
}
init();
