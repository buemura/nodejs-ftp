import { Logger } from "../app/interfaces/logger";

export class LoggerImpl implements Logger {
  info(message: string): void {
    console.log(message);
  }

  error(message: string, error?: any): void {
    console.error(message, error || "");
  }
}
