import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { IncomingMessage, ServerResponse } from "http";
import { HttptraceRepository } from "./httptrace.repository";

interface HttpTrace {
  request: {
    headers: { [key: string]: string[] };
    method: string;
    uri: string;
  };
  response: { headers: { [key: string]: string[] }; status: number };
  timeTaken: number;
  timestamp: number;
}

@Injectable()
export class HttptraceInterceptor implements NestInterceptor {
  constructor(private traceRepository: HttptraceRepository) {}

  intercept(
    context: ExecutionContext,
    call$: CallHandler
  ): Observable<unknown> {
    const now = Date.now();
    return call$.handle().pipe(
      tap(() => {
        this.addHttptrace(context, now);
      }),
      catchError((err) => {
        this.addHttptrace(context, now, err);
        return throwError(err);
      })
    );
  }

  /* testing */ addHttptrace(
    context: ExecutionContext,
    incomingTime: number,
    error?: Error
  ): void {
    const request = context.switchToHttp().getRequest();
    const delay = Date.now() - incomingTime;

    const response = context.switchToHttp().getResponse();
    if (
      request instanceof IncomingMessage &&
      response instanceof ServerResponse
    ) {
      const currentTrace: HttpTrace = {
        request: {
          headers: HttptraceInterceptor.arrayizeHeaders(request.headers),
          method: request.method,
          uri: request.url,
        },
        response: {
          headers: HttptraceInterceptor.arrayizeHeaders(response.getHeaders()),
          status: HttptraceInterceptor.getResponseStatus(error, response),
        },
        timeTaken: delay,
        timestamp: incomingTime,
      };
      this.traceRepository.addTrace(currentTrace);
    }
  }

  private static getResponseStatus(error: Error, response: ServerResponse) {
    return error
      ? HttptraceInterceptor.getErrorCode(error)
      : response.statusCode;
  }

  /**
   * Try to find the error code through exceptiont ype. If not present, we can't know, so set to 0
   * @param error the error that triggered the request to stop
   */
  private static getErrorCode(error: Error | HttpException) {
    return error instanceof HttpException ? error.getStatus() : 0;
  }

  /**
   * Format headers so each one is an array of values
   * @param headers
   */
  private static arrayizeHeaders(
    headers: NodeJS.Dict<number | string | string[]>
  ): { [key: string]: string[] } {
    const arrayizedHeaders = {};
    Object.keys(headers).forEach((key) => {
      if (headers[key]) arrayizedHeaders[key] = [headers[key]];
    });
    return arrayizedHeaders;
  }
}
