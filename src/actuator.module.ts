import { DynamicModule, HttpModule } from "@nestjs/common";
import {
  ACTUATOR_ENDPOINTS,
  ACTUATOR_MODULE_OPTIONS,
} from "./actuator.constant";
import { ScheduleModule } from "@nestjs/schedule";
import { RegistrationService } from "./registration/registration.service";
import { optionalRequire } from "@nestjs/core/helpers/optional-require";
import { ActuatorController } from "./endpoints/actuator.controller";
import { DefaultHealthEndpoint } from "./endpoints/health/defaultHealth.endpoint";
import { ActuatorEndpoint } from "./endpoints/endpoint.interface";
import { DefaultEnvEndpoint } from "./endpoints/health/defaultEnv.endpoint";
import {Provider} from "@nestjs/common/interfaces/modules/provider.interface";

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
}

export class ActuatorModule {
  static forRoot(options: ActuatorModuleOptions): DynamicModule {
    const optionalDependencies = [];

    const endpointMap: Record<string, ActuatorEndpoint> = {
      health: ActuatorModule.getHealthEndpoint(),
      env: ActuatorModule.getEnvEndpoint(),
    };
    let providers: Provider[] = [
      {
        provide: ACTUATOR_MODULE_OPTIONS,
        useValue: Object.assign({}, options),
      },
      {
        provide: ACTUATOR_ENDPOINTS,
        useValue: endpointMap,
      }
    ];

    if(options.registration) {
      providers.push(RegistrationService);
    }
    const moduleForRoot: DynamicModule = {
      module: ActuatorModule,
      imports: [HttpModule, ScheduleModule.forRoot(), ...optionalDependencies],
      controllers: [ActuatorController],
      providers: providers,
    };
    return moduleForRoot;
  }

  private static getHealthEndpoint() {
    return new DefaultHealthEndpoint();
  }

  private static getEnvEndpoint() {
    return new DefaultEnvEndpoint();
  }
}
