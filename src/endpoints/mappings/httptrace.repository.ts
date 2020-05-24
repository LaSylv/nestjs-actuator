import { Injectable } from "@nestjs/common";
import { OutgoingHttpHeaders } from "http";
import { IncomingHttpHeaders } from "http";

interface HttpTrace {
  request: { headers: IncomingHttpHeaders; method: string; uri: string };
  response: { headers: OutgoingHttpHeaders; status: number };
  timeTaken: number;
  timestamp: number;
}

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
  private traces: any[] = [];

  addTrace(trace: HttpTrace) {
    this.traces.push(trace);
    if (this.traces.length > MAX_IN_MEMORY_HTTP_TRACE) {
      this.traces.shift();
    }
  }

  getTraces(): HttpTrace[] {
    return this.traces;
  }
}
