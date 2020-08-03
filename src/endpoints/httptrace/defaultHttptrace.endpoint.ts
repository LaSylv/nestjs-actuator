import { ActuatorEndpoint } from "../endpoint.interface";
import { Injectable } from "@nestjs/common";
import { HttptraceRepository } from "./httptrace.repository";
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";

type Traces = { traces: HttpTrace[] };
export interface HttpTrace {
  request: { headers: IncomingHttpHeaders; method: string; uri: string };
  response: { headers: OutgoingHttpHeaders; status: number };
  timeTaken: number;
  timestamp: number;
}

/**
 * Default http trace endpoint.
 */
@Injectable()
export class DefaultHttptraceEndpoint implements ActuatorEndpoint<Traces> {
  constructor(private traceRepository: HttptraceRepository) {}

  compute(): Traces {
    return {
      traces: this.traceRepository.getTraces(),
    };
  }
}
