import { LogLevel } from './log-level.enum';

export interface ILogEntry {
  message: string;
  timestamp: string;
  metaData?: any;
  level: LogLevel;
}
