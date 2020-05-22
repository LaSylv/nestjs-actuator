import { ActuatorEndpoint } from "../endpoint.interface";
import { Inject } from "@nestjs/common";
import { ACTUATOR_MODULE_OPTIONS } from "../../actuator.constant";
import { ActuatorModuleOptions } from "../../actuator.module";

const scrubbingRegex = /^.*key.*|.*secret.*|.*password.*|.*token.*/;

export class DefaultInfoEndpoint implements ActuatorEndpoint {
  constructor(
    @Inject(ACTUATOR_MODULE_OPTIONS)
    private readonly options: ActuatorModuleOptions
  ) {}

  compute(): any {
    return {
      build: {
        version: process.env.npm_package_version,
        artifact: this.options.registration.name,
        group: "com.example",
      },
    };
  }
}
