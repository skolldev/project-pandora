import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Logger } from './logger.service';

// Inspired by
// https://medium.com/angular-in-depth/expecting-the-unexpected-best-practices-for-error-handling-in-angular-21c3662ef9e4
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  public handleError(error: Error | HttpErrorResponse): void {
    const logger = this.injector.get(Logger);

    if (error instanceof HttpErrorResponse) {
      // Server error
      const message = this.getServerMessage(error);
      logger.error(message);
    } else {
      // Client  error
      const message = this.getClientMessage(error);
      const stackTrace = this.getClientStack(error);
      logger.error(message, stackTrace);
    }
  }

  private getClientMessage(error: Error): string {
    return error.message ? error.message : error.toString();
  }

  private getClientStack(error: Error): string | undefined {
    return error.stack;
  }

  private getServerMessage(error: HttpErrorResponse): string {
    return error.message;
  }
}
