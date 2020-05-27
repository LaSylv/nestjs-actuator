import { ActuatorEndpoint } from "../endpoint.interface";
import { Inject } from "@nestjs/common";
import { ACTUATOR_MODULE_OPTIONS } from "../../actuator.constant";
import { ActuatorModuleOptions } from "../../actuator.module";

type Info = { build: { version: string; artifact: string } };
export class DefaultInfoEndpoint implements ActuatorEndpoint<Info> {
  constructor(
    @Inject(ACTUATOR_MODULE_OPTIONS)
    private readonly options: ActuatorModuleOptions
  ) {}

  compute(): Info {
    return {
      build: {
        version: process.env.npm_package_version,
        artifact: this.options.registration?.name,
      },
    };
  }
}
