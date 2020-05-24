import {
  BeforeApplicationShutdown,
  HttpService,
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ACTUATOR_MODULE_OPTIONS } from "../actuator.constant";
import { ActuatorModuleOptions } from "../actuator.module";
import { ApplicationConfig } from "@nestjs/core";
import { AxiosBasicCredentials } from "axios";

/**
 * Expected data to register ti Spring Boot Admin
 * */
export interface ApplicationRegistration {
  name: string;
  managementUrl: string;
  healthUrl: string;
  serviceUrl: string;
  metadata: any;
  auth?: AxiosBasicCredentials;
  id?: string;
}

@Injectable()
export class RegistrationService
  implements OnApplicationBootstrap, BeforeApplicationShutdown {
  private readonly logger = new Logger(RegistrationService.name);

  // Dirty however, DEFAULT scope make this work
  private registrationId: string;

  constructor(
    @Inject(ACTUATOR_MODULE_OPTIONS)
    private readonly options: ActuatorModuleOptions,
    private readonly applicationConfig: ApplicationConfig,
    private httpService: HttpService
  ) {}

  beforeApplicationShutdown() {
    let adminServerUrl = this.options.registration.adminServerUrl;

    this.httpService.delete(
      `${adminServerUrl}/instances/${this.registrationId}`
    );
  }

  onApplicationBootstrap() {
    this.refreshRegistration();
  }

  @Cron("0 * * * * *")
  cronRegistration() {
    this.refreshRegistration();
  }

  refreshRegistration() {
    const applicationRegistration = this.computeRegistration();
    let adminServerUrl = this.options.registration.adminServerUrl;
    this.httpService
      .post(adminServerUrl + "/instances", applicationRegistration, {
        auth: applicationRegistration.auth,
      })
      .toPromise()
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          this.handleSuccessfullResponse(
            response,
            applicationRegistration,
            adminServerUrl
          );
        }
      })
      .catch((exception) => {
        this.logger.warn(
          `Unable to register application to [${adminServerUrl}] due to [${exception}]`
        );
      });
  }

  private handleSuccessfullResponse(
    response,
    applicationRegistration: ApplicationRegistration,
    adminServerUrl: string
  ) {
    const registrationId: string = response.data.id;
    if (applicationRegistration.id === undefined) {
      this.setRegistrationId(registrationId);
      this.logger.log(
        `Registered to [${adminServerUrl}] with id [${registrationId}]`
      );
    } else if (this.registrationId === registrationId) {
      this.logger.debug(
        `Refreshed registration to [${adminServerUrl}] with id [${registrationId}]`
      );
    } else {
      this.logger.log(
        `Refreshed registration to [${adminServerUrl}] and got new id [${registrationId}]`
      );
    }
    this.setRegistrationId(response.data.id);
  }

  computeRegistration(): ApplicationRegistration {
    if (!this.options.registration) {
      return;
    }
    const serviceUrl = this.options.registration.serviceUrl;

    const appVersion = process.env.npm_package_version;
    return {
      managementUrl: serviceUrl + "/actuator",
      healthUrl: serviceUrl + "/actuator/health",
      serviceUrl: serviceUrl,
      name: this.options.registration.name,
      id: this.registrationId,
      auth: this.options.registration.auth,
      metadata: {
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version,
      },
    };
  }

  public setRegistrationId(id: string) {
    this.registrationId = id;
  }
}
