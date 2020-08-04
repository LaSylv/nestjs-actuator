import { DefaultHttptraceEndpoint } from "./defaultHttptrace.endpoint";
import { Provider } from "@nestjs/common";
import { ACTUATOR_ENDPOINT_PREFIX } from "../../actuator.constant";
import {
  HttptraceRepository,
  InMemoryHttpTraceRepository,
} from "./httptrace.repository";
import { HttptraceInterceptor } from "./httptrace.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

export default function getHttptraceEndpoint(): Provider[] {
  return [
    {
      provide: ACTUATOR_ENDPOINT_PREFIX + "httptrace",
      useClass: DefaultHttptraceEndpoint,
    },
    {
      provide: HttptraceRepository,
      useClass: InMemoryHttpTraceRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttptraceInterceptor,
    },
  ];
}
