import { DynamicModule, HttpModule } from "@nestjs/common";
import {
  ACTUATOR_AVAILABLE_ENDPOINTS,
  ACTUATOR_MODULE_OPTIONS,
} from "./actuator.constant";
import { ScheduleModule } from "@nestjs/schedule";
import { RegistrationService } from "./registration/registration.service";
import { ActuatorController } from "./endpoints/actuator.controller";
import { Provider } from "@nestjs/common/interfaces/modules/provider.interface";
import { AxiosBasicCredentials } from "axios";
import getHealthEndpoint from "./endpoints/health/health.provider";
import getEnvEndpoint from "./endpoints/env/env.provider";
import getInfoEndpoint from "./endpoints/info/info.provider";
import getHttptraceEndpoint from "./endpoints/httptrace/httptrace.provider";
import getBeansEndpoint from "./endpoints/beans/beans.provider";

export interface ActuatorModuleOptions {
  /**
   * Informations to register to Spring Boot Admin. Set to false to not register and only expose actuator endpoints
   */
  registration?: RegistrationOptions;
}

export interface RegistrationOptions {
  /**
   * Name of your app
   */
  name: string;
  /**
   * Url of the Spring Boot Admin Server
   */
  adminServerUrl: string;
  /**
   * Url of your service. Should be accessible by the Spring Boot Admin Server
   */
  serviceUrl: string;

  /**
   * Authentication credentials using basic auth
   */
  auth?: AxiosBasicCredentials;

  /**
   * Optional additional metadatas
   */
  metadata?: Record<string, unknown>;
}

export class ActuatorModule {
  static forRoot(options: ActuatorModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: ACTUATOR_MODULE_OPTIONS,
        useValue: Object.assign({}, options),
      },
      {
        provide: ACTUATOR_AVAILABLE_ENDPOINTS,
        useValue: ["env", "info", "health", "httptrace", "beans"],
      },
    ];
    providers.push(
      getHealthEndpoint(),
      getEnvEndpoint(),
      getInfoEndpoint(),
      getBeansEndpoint(),
      ...getHttptraceEndpoint()
    );

    if (options.registration) {
      providers.push(RegistrationService);
    }
    return {
      module: ActuatorModule,
      imports: [HttpModule, ScheduleModule.forRoot()],
      controllers: [ActuatorController],
      providers: providers,
    };
  }
}
