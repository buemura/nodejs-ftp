import "dotenv/config";
import fs from "fs";
import path from "path";
import { from as copyFrom } from "pg-copy-streams";

import { conn } from "../providers/db";

async function init() {
  const ignoreFiles = [".gitkeep"];
  const basePath = "./temp";

  try {
    const files = fs.readdirSync(basePath, {
      withFileTypes: true,
      recursive: true,
    });

    for (const file of files) {
      if (ignoreFiles.includes(file.name) || file.isDirectory()) {
        continue;
      }

      const filePath = path.resolve(file.parentPath, file.name);
      const tableName = path.basename(file.name, path.extname(file.name));

      console.log(
        `Starting import for table: ${tableName} from file: ${filePath}`
      );

      // Stream file to PostgreSQL
      const fileStream = fs.createReadStream(filePath);
      const client = await conn.connect();

      try {
        const copyQuery = `
          COPY ${tableName}
          FROM STDIN
          WITH DELIMITER '|' NULL AS '' ENCODING 'ISO88591'
        `;
        const copyStream = client.query(copyFrom(copyQuery));

        // Pipe file content to PostgreSQL COPY operation
        fileStream.pipe(copyStream);

        await new Promise((resolve, reject) => {
          copyStream.on("finish", resolve);
          copyStream.on("error", reject);
          fileStream.on("error", reject);
        });

        console.log(`Import completed for table: ${tableName}`);

        console.log(`Deleting temp file: ${filePath}`);
        fs.unlinkSync(filePath);
        console.log(`Deleted temp file: ${filePath}`);
      } catch (err) {
        console.error(`Failed to import data for table: ${tableName}`, err);
      } finally {
        client.release();
      }
    }
  } catch (err) {
    console.error("Error during streaming:", err);
  } finally {
    await conn.end();
  }
}

init();
