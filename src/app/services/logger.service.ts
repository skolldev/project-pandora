import { Injectable } from "@angular/core";

import { format } from "date-fns";
import { LogLevel } from "src/app/models/log-level.enum";
import { ILogEntry } from "src/app/models/log-entry.interface";
import { environment } from "src/environments/environment";

class PerformanceTimer {
  public timerName: string;
  private startTime: Date;

  constructor(name: string) {
    this.startTime = new Date();
    this.timerName = name;
  }

  /**
   * Stops the running timer and returns the elapsed time in milliseconds
   */
  public stop(): number {
    const endTime = new Date();
    const elapsedMs = endTime.getTime() - this.startTime.getTime();
    return elapsedMs;
  }
}

/**
 * Allows you to log messages to a memory history as well as the console
 */
@Injectable({
  providedIn: "root"
})
export class Logger {
  /**
   * Whether logs should be logged to the console
   * in addition to the internal history
   */
  private shouldConsoleLog: boolean;

  /**
   * The log history of the current instance. Only saved in memory
   */
  private logHistory: ILogEntry[] = [];

  /**
   * Contains all currently running timers
   */
  private runningTimers: PerformanceTimer[] = [];

  constructor() {
    this.shouldConsoleLog = !environment.production;
  }

  /**
   * Logs a regular message.
   *
   * Accepts a string message and optionally additional data.
   *
   * * In production, only logs to the memory
   * * In development, also logs to the console.
   * @param message The message that should be logged
   * @param metaData Additional data that should be logged
   */
  public log(message: string, metaData?: any): void {
    this.internalLog(LogLevel.INFO, message, metaData);
  }

  /**
   * Logs an http call.
   *
   * Accepts a string message and optionally additional data.
   *
   * * In production, only logs to the memory
   * * In development, also logs to the console.
   * @param message The message that should be logged
   * @param metaData Additional data that should be logged
   */
  public http(message: string, metaData?: any): void {
    this.internalLog(LogLevel.HTTP, message, metaData);
  }

  /**
   * Logs a warning message
   *
   * Accepts a string message and optionally additional data.
   *
   * * In production, only logs to the memory
   * * In development, also logs to the console.
   * @param message The message that should be logged
   * @param metaData Additional data that should be logged
   */
  public warn(message: string, metaData?: any): void {
    this.internalLog(LogLevel.WARN, message, metaData);
  }

  /**
   * Logs an error message
   *
   * Accepts a string message and optionally additional data.
   *
   * * In production, only logs to the memory
   * * In development, also logs to the console.
   * @param message The message that should be logged
   * @param metaData Additional data that should be logged
   */
  public error(message: string, metaData?: any): void {
    this.internalLog(LogLevel.ERROR, message, metaData);
  }

  /**
   * Starts a timer for the action with the given name, to check performance.
   *
   * Call stopPerformanceLog to stop the timer
   * @param name The name that should be used when logging in the console
   */
  public startPerformanceLog(name: string): void {
    if (this.runningTimers.find((t) => t.timerName === name)) {
      this.error(`There is already a running timer for ${name}`);
      return;
    }

    this.internalLog(LogLevel.PERF, `Performance timer started for ${name}`);
    const timer = new PerformanceTimer(name);
    this.runningTimers.push(timer);
  }

  /**
   * Stops a running performance timer
   *
   * Logs the elapsed time to the console
   * @param name The name that was used when starting the timner
   */
  public stopPerformanceLog(name: string): void {
    const timerIndex = this.runningTimers.findIndex(
      (t) => t.timerName === name
    );
    if (timerIndex === -1) {
      this.error(`There is no running timer for ${name}`);
      return;
    }

    const timer = this.runningTimers[timerIndex];

    const elapsedTime = timer.stop();
    this.runningTimers.splice(timerIndex, 1);
    this.internalLog(
      LogLevel.PERF,
      `${name} completed in ${elapsedTime}ms (${elapsedTime / 1000}s)`
    );
  }

  /**
   * Returns all logs that have been made in this session
   */
  public getHistory(): ILogEntry[] {
    return this.logHistory;
  }

  private internalLog(level: LogLevel, message: string, metaData?: any): void {
    const timestamp = new Date();
    this.logToMemory(level, message, timestamp, metaData);
    if (this.shouldConsoleLog) {
      this.logToConsole(level, message, timestamp, metaData);
    }
  }

  /**
   * Logs the given message to the internal log history
   * @param message The message that should be logged
   * @param time The current time
   * @param metaData Any meta data that should be logged as well
   */
  private logToMemory(
    level: LogLevel,
    message: string,
    time: Date,
    metaData?: any
  ): void {
    const timestamp = time.toISOString();

    const logEntry: ILogEntry = {
      level,
      message,
      timestamp
    };
    if (metaData) {
      logEntry.metaData = metaData;
    }
    this.logHistory.push(logEntry);
  }

  /**
   * Logs the given messagen / meta data to the console
   * @param message The message that should be logged
   * @param time The current time
   * @param metaData Any meta data that should be logged as well
   */
  private logToConsole(
    level: LogLevel,
    message: string,
    time: Date,
    metaData?: any
  ): void {
    // Log the exact value of the object the moment we log it
    // Otherwise we log the reference, which might cause confusion
    const formattedMessage = this.formatMessage(level, message, time);
    if (metaData) {
      this.logMetaDataToConsole(level, formattedMessage, metaData);
    } else {
      this.console(level, formattedMessage);
    }
  }

  /**
   * Logs the formatted message and the meta data, wrapped by
   * a console group for better readability
   * @param formattedMessage The already formatted log message
   * @param metaData Any meta data that should be logged inside the group
   */
  private logMetaDataToConsole(
    level: LogLevel,
    formattedMessage: string,
    metaData: any
  ): void {
    console.groupCollapsed(formattedMessage);
    const fixedData = this.deepCopyObject(metaData);
    if (Array.isArray(fixedData)) {
      console.table?.(fixedData);
    } else {
      this.console(level, fixedData);
    }
    console.groupEnd();
  }

  /**
   * Logs to the correct console based on the provided log level
   */
  private console(level: LogLevel, message: any): void {
    switch (level) {
      case LogLevel.INFO:
      case LogLevel.HTTP:
      case LogLevel.PERF:
        return console.log(message);
      case LogLevel.WARN:
        return console.warn(message);
      case LogLevel.ERROR:
        return console.error(message);
      default:
        return console.log(message);
    }
  }

  /**
   * Uses the given parameters to format the log message
   */
  public formatMessage(
    level: LogLevel,
    message: string,
    timestamp: Date
  ): string {
    const formattedTime = format(timestamp, "dd.MM.yyyy hh:mm");
    return `[${formattedTime}] ${level}: ${message}`;
  }

  /**
   * Returns true if the argument is an object
   */
  private isObj(obj: any): boolean {
    return obj === Object(obj);
  }

  /**
   * Tries to return a stringified version of the given object
   */
  private getObjectAsString(obj: any): string {
    // The value is a primitive, no need to convert it
    if (!this.isObj) {
      return obj.toString();
    }

    // Could be a cyclic object, better wrap this
    try {
      return JSON.stringify(obj);
    } catch {
      return "Cyclic object value detected, could not parse";
    }
  }

  /**
   * Returns a deep copy of the given object if it is an object,
   * Returns the input if it is a primitive
   */
  private deepCopyObject(obj: any): any {
    // The value is a primitive, no need to copy it
    if (!this.isObj) {
      return obj;
    }

    // Could be a cyclic object, better wrap this
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      return "Cyclic object value detected, could not parse";
    }
  }
}
