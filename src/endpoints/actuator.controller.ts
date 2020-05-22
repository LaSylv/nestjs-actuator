import {
  Controller,
  Get,
  Header,
  Inject,
  Injectable,
  NotFoundException,
  Param,
} from "@nestjs/common";
import {
  ACTUATOR_ENDPOINTS,
  ACTUATOR_MODULE_OPTIONS,
} from "../actuator.constant";
import { ActuatorEndpoint } from "./endpoint.interface";
import { ActuatorModuleOptions } from "../actuator.module";

@Controller("actuator")
@Injectable()
export class ActuatorController {
  constructor(
    @Inject(ACTUATOR_MODULE_OPTIONS)
    private readonly options: ActuatorModuleOptions,

    @Inject(ACTUATOR_ENDPOINTS)
    private endpoints: Record<string, ActuatorEndpoint>
  ) {}

  @Get()
  @Header("Content-Type", "application/vnd.spring-boot.actuator.v2+json")
  root(): any {
    return this.getActiveLinks();
  }

  @Get(":key")
  @Header("Content-Type", "application/vnd.spring-boot.actuator.v2+json")
  findOne(@Param("key") key): any {
    if (!this.endpoints[key]) {
      throw new NotFoundException();
    } else {
      return this.endpoints[key].compute();
    }
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
    Object.keys(this.endpoints).forEach((key) => {
      returnValue._links[key] = {
        href: managementUrl + key,
        templated: false,
      };
    });
    return returnValue;
  }
}
