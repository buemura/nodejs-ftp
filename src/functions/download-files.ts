import "dotenv/config";
import { FtpProvider } from "../providers/ftp";

async function init() {
  const tempPath = "./temp";
  const basePath = "./test";
  const ftp = new FtpProvider();

  try {
    await ftp.connect();
    console.log("Connected to FTP server");

    await ftp.downloadFiles(tempPath, basePath);
  } catch (error) {
    console.error("FTP Error:", error.message);
  } finally {
    ftp.disconnect();
    console.log("Disconnected from FTP server");
  }
}

init();
