import {
  Inject,
  Injectable
} from "@nestjs/common";
import { ACTUATOR_MODULE_OPTIONS } from "../actuator.constant";
import {
  ActuatorModuleOptions,
} from "../actuator.module";
import * as os from "os";
import { ApplicationConfig } from "@nestjs/core";
import {ApplicationRegistration} from "../registration/registration.service";


interface ActuatorConfiguration {
  registration: ApplicationRegistration;
  adminUrl: string;
}


@Injectable()
export class ConfigurationService {
  // Dirty but how else? DEFAULT scope make this work
  private registrationId: string;
  constructor(
    @Inject(ACTUATOR_MODULE_OPTIONS)
    private readonly options: ActuatorModuleOptions,
    private readonly applicationConfig: ApplicationConfig
  ) {}

  public getActuatorConfiguration(): ActuatorConfiguration {
    return {
      registration: this.computeRegistration(),
      adminUrl: this.options.adminServerUrl,
    };
  }

  computeRegistration(): ApplicationRegistration {
    const serviceUrl =
      this.options.serviceUrl ||
      "http://" +
        os.hostname() +
        ":3000" +
        (this.applicationConfig.getGlobalPrefix()
          ? "/" + this.applicationConfig.getGlobalPrefix()
          : "");

    const appVersion = process.env.npm_package_version;
    return {
      managementUrl: serviceUrl + "/actuator",
      healthUrl: serviceUrl + "/actuator/health",
      serviceUrl: serviceUrl,
      name: this.options.name,
      id: this.registrationId,
      metadata: {
        timestamp: new Date().toISOString(),
        "build.version": process.env.npm_package_version,
      },
    };
  }

  public setRegistrationId(id: string) {
    this.registrationId = id;
  }
}
