import {
  HttpService,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ConfigurationService } from "../configuration/configuration.service";


/**
 * Expected data to register ti Spring Boot Admin
 * */
export interface ApplicationRegistration {
  name: string;
  managementUrl: string;
  healthUrl: string;
  serviceUrl: string;
  metadata: any;
  id?: string;
}

@Injectable()
export class RegistrationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    private configurationService: ConfigurationService,
    private httpService: HttpService
  ) {}

  onApplicationBootstrap() {
    this.refreshRegistration();
  }

  @Cron("*/10 * * * * *")
  healthCheck() {
    this.refreshRegistration();
  }

  private refreshRegistration() {
    this.httpService
      .post(
        this.configurationService.getActuatorConfiguration().adminUrl +
          "/instances",
        this.configurationService.getActuatorConfiguration().registration
      )
      .toPromise()
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const registrationId: string = response.data.id;
          if (
            this.configurationService.getActuatorConfiguration().registration
              .id === undefined
          ) {
            this.configurationService.setRegistrationId(registrationId);
            this.logger.log(
              `Registered to [${
                this.configurationService.getActuatorConfiguration().adminUrl
              }] with id [${registrationId}]`
            );
          } else if (
            this.configurationService.getActuatorConfiguration().registration
              .id === registrationId
          ) {
            this.logger.debug(
              `Refreshed registration to [${
                this.configurationService.getActuatorConfiguration().adminUrl
              }] with id [${registrationId}]`
            );
          } else {
            this.logger.log(
              `Refreshed registration to [${
                this.configurationService.getActuatorConfiguration().adminUrl
              }] and got new id [${registrationId}]`
            );
          }
          this.configurationService.getActuatorConfiguration().registration.id =
            response.data.id;
        }
      })
      .catch((exception) => {
        this.logger.warn(
          `Unable to register application to [${
            this.configurationService.getActuatorConfiguration().adminUrl
          }] due to [${exception}]`
        );
      });
  }
}
