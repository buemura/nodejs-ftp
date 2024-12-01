import * as fs from "fs";
import * as stream from "stream";

export interface DrugDbRepository {
  buildCopyQuery(tableName: string): stream.Writable;
  streamToTable(fileStream: fs.ReadStream, tableName: string): Promise<void>;
  closeConnection(): Promise<void>;
}
