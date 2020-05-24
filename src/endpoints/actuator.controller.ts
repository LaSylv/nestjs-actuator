import {
  Controller,
  Get,
  Header,
  HttpException,
  Inject,
  Injectable,
  Param,
} from "@nestjs/common";
import {
  ACTUATOR_AVAILABLE_ENDPOINTS,
  ACTUATOR_ENDPOINT_PREFIX,
  ACTUATOR_MODULE_OPTIONS,
} from "../actuator.constant";
import { ActuatorEndpoint } from "./endpoint.interface";
import { ActuatorModuleOptions } from "../actuator.module";
import { ModuleRef } from "@nestjs/core";

@Controller("actuator")
@Injectable()
export class ActuatorController {
  constructor(
    @Inject(ACTUATOR_MODULE_OPTIONS)
    private readonly options: ActuatorModuleOptions,
    private moduleRef: ModuleRef,
    @Inject(ACTUATOR_AVAILABLE_ENDPOINTS)
    private availableEndpoints: string[]
  ) {}

  @Get()
  @Header("Content-Type", "application/vnd.spring-boot.actuator.v2+json")
  root(): any {
    return this.getActiveLinks();
  }

  @Get(":key")
  @Header("Content-Type", "application/vnd.spring-boot.actuator.v2+json")
  findOne(@Param("key") key): any {
    if (!this.availableEndpoints.includes(key)) {
      throw new HttpException(`Endpoint [${key}] is not configured`, 404);
    }
    const actuatorEndpoint = this.moduleRef.get<string, ActuatorEndpoint>(
      ACTUATOR_ENDPOINT_PREFIX + key
    );
    return actuatorEndpoint.compute();
  }

  private getActiveLinks(): any {
    const managementUrl = this.options.registration
      ? this.options.registration.serviceUrl + "actuator/"
      : "/";
    const returnValue = {
      _links: {
        self: {
          href: managementUrl,
          templated: false,
        },
      },
    };
    this.availableEndpoints.forEach((key) => {
      returnValue._links[key] = {
        href: managementUrl + key,
        templated: false,
      };
    });
    return returnValue;
  }
}
