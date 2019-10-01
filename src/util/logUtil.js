import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { printf, timestamp, combine } = format;

const myFormat = printf(info => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`);

const transport = new (DailyRotateFile)({
  filename: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  // zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

export const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat,
  ),
  transports: [
    transport,
    new transports.Console(),
  ],
});
