import { DynamicModule, HttpModule } from '@nestjs/common';
import { ACTUATOR_ENDPOINTS, ACTUATOR_MODULE_OPTIONS } from './actuator.constant';
import { ScheduleModule } from '@nestjs/schedule';
import {ApplicationRegistration, RegistrationService} from './registration/registration.service';
import { ConfigurationService } from './configuration/configuration.service';
import { optionalRequire } from '@nestjs/core/helpers/optional-require';
import { ActuatorController } from './endpoints/actuator.controller';
import { DefaultHealthEndpoint } from './endpoints/health/defaultHealth.endpoint';
import { ActuatorEndpoint } from './endpoints/endpoint.interface';
import { DefaultEnvEndpoint } from './endpoints/health/defaultEnv.endpoint';
const { TerminusModule } = optionalRequire('@nestjs/terminus', () => require('@nestjs/terminus'));

export interface ActuatorModuleOptions {
    name: string;
    adminServerUrl: string;
    serviceUrl?: string;
}

export class ActuatorModule {
    static forRoot(options: ActuatorModuleOptions): DynamicModule {
        const optionalDependencies = [];
        if (TerminusModule) {
            optionalDependencies.push(TerminusModule);
        }

        const endpointMap: Record<string, ActuatorEndpoint> = {
            health: ActuatorModule.getHealthEndpoint(),
            env: ActuatorModule.getEnvEndpoint(),
        };
        const moduleForRoot: DynamicModule = {
            module: ActuatorModule,
            imports: [HttpModule, ScheduleModule.forRoot(), ...optionalDependencies],
            controllers: [ActuatorController],
            providers: [
                ConfigurationService,
                {
                    provide: ACTUATOR_MODULE_OPTIONS,
                    useValue: Object.assign({}, options),
                },
                {
                    provide: ACTUATOR_ENDPOINTS,
                    useValue: endpointMap,
                },
                RegistrationService,
            ],
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
