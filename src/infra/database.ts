import fs from "fs";
import stream from "stream";
import { Pool, PoolClient } from "pg";
import { from as copyFrom } from "pg-copy-streams";

import { env } from "../configs/env";
import { DrugDbRepository } from "../app/interfaces/drug-db-repository";

export class PgDrugDbRepository implements DrugDbRepository {
  private conn: Pool;
  private client: PoolClient;

  constructor() {
    this.conn = new Pool({
      host: env.DATABASE_HOST,
      port: Number(env.DATABASE_PORT),
      user: env.DATABASE_USER,
      password: env.DATABASE_PASS,
      database: env.DATABASE_NAME,
    });
  }

  buildCopyQuery(tableName: string): stream.Writable {
    const query = `
      COPY ${tableName}
      FROM STDIN
      WITH DELIMITER '|' NULL AS '' ENCODING 'ISO88591'
    `;
    return this.client.query(copyFrom(query));
  }

  async streamToTable(
    fileStream: fs.ReadStream,
    tableName: string
  ): Promise<void> {
    this.client = await this.conn.connect();
    const copyStream = this.buildCopyQuery(tableName);

    fileStream.pipe(copyStream);

    await new Promise<void>((resolve, reject) => {
      copyStream.on("finish", resolve);
      copyStream.on("error", reject);
      fileStream.on("error", reject);
    });

    this.client.release();
  }

  /**
   * Executes a query from a .sql file.
   * @param filePath Path to the .sql file
   */
  async executeQueryFromFile(filePath: string): Promise<void> {
    this.client = await this.conn.connect();

    const query = fs.readFileSync(filePath, "utf-8");
    await this.client.query(query);

    this.client.release();
  }

  async closeConnection(): Promise<void> {
    await this.conn.end();
  }
}
