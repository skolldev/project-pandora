import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, finalize } from "rxjs/operators";
import { Logger } from "./logger.service";

@Injectable()
export class HttpLoggingInterceptor implements HttpInterceptor {
  constructor(private logger: Logger) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    let status: string;
    let response: any;

    return next.handle(request).pipe(
      tap(
        (event) => {
          status = "";
          if (event instanceof HttpResponse) {
            status = "succeeded";
            response = event.body;
          }
        },
        ({ error, status: errorStatus, statusText }) => {
          status = "failed";
          response = {
            error,
            status: errorStatus,
            statusText
          };
        }
      ),
      finalize(() => {
        const elapsedTime = Date.now() - startTime;
        const message = `${request.method} ${request.urlWithParams} ${status} in ${elapsedTime}ms`;
        this.logger.http(message, response);
      })
    );
  }
}
