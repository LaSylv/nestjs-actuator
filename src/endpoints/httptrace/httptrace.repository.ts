import { Injectable } from "@nestjs/common";
import { HttpTrace } from "./defaultHttptrace.endpoint";

const MAX_IN_MEMORY_HTTP_TRACE = 100;

export abstract class HttptraceRepository {
  abstract addTrace(trace: HttpTrace);
  abstract getTraces(): HttpTrace[];
}

/**
 * Default httptrace repository.
 */
@Injectable()
export class InMemoryHttpTraceRepository implements HttptraceRepository {
  private traces: HttpTrace[] = [];

  addTrace(trace: HttpTrace): void {
    this.traces.push(trace);
    if (this.traces.length > MAX_IN_MEMORY_HTTP_TRACE) {
      this.traces.shift();
    }
  }

  getTraces(): HttpTrace[] {
    return this.traces;
  }
}
