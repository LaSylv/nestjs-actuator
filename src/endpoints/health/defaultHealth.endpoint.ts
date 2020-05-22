import { ActuatorEndpoint } from '../endpoint.interface';

export class DefaultHealthEndpoint implements ActuatorEndpoint {
    compute(): any {
        return {
            status: 'UP',
            details: {},
        };
    }
}
