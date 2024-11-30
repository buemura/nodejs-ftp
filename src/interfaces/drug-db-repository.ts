import fs from "fs";
import stream from "stream";

export interface DrugDbRepository {
  buildCopyQuery(tableName: string): stream.Writable;
  streamToTable(fileStream: fs.ReadStream, tableName: string): Promise<void>;
  closeConnection(): Promise<void>;
}
