import { app, InvocationContext, Timer } from "@azure/functions";
import { LoggerImpl } from "../infra/logger";
import { BasicFtpProvider } from "../infra/ftp";
import { FileHandlerImpl } from "../infra/file-handler";
import { PgDrugDbRepository } from "../infra/database";
import { DownloadFileService } from "../app/services/download-files.service";
import { UpdateDrugDbRecords } from "../app/services/update-record.service";
import { env } from "../configs/env";

export async function updateDatabase(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("@@@@ starting updateDatabaseFunction");

  context.log({
    FTP_SERVER_HOST: env.FTP_SERVER_HOST,
    FTP_SERVER_USER: env.FTP_SERVER_USER,
    FTP_SERVER_PASS: env.FTP_SERVER_PASS,
  });

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
  // await updateDrugDbRecords.execute();
}

app.timer("updateDatabase", {
  schedule: "*/10 * * * * *",
  handler: updateDatabase,
});
