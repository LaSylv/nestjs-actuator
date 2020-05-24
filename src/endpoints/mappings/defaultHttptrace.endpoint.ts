import { ActuatorEndpoint } from "../endpoint.interface";
import { Injectable } from "@nestjs/common";
import { HttptraceRepository } from "./httptrace.repository";

/**
 * Default http trace endpoint.
 */
@Injectable()
export class DefaultHttptraceEndpoint implements ActuatorEndpoint {
  constructor(private traceRepository: HttptraceRepository) {}

  compute(): any {
    return {
      traces: this.traceRepository.getTraces(),
    };
  }
}
