import { ActuatorEndpoint } from '../endpoint.interface';

export class DefaultEnvEndpoint implements ActuatorEndpoint {
    compute(): any {
        const properties = {};
        Object.keys(process.env).forEach((key) => {
            properties[key] = {
                value: process.env[key],
            };
        });
        return {
            // needed to not crash SBA interface
            activeProfiles: [],
            propertySources: [
                {
                    name: 'systemEnvironment',
                    properties: properties,
                },
            ],
        };
    }
}
