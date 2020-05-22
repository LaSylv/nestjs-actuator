import { ActuatorEndpoint } from '../endpoint.interface';

/**
 * Default health endpoint.
 */
export class DefaultHealthEndpoint implements ActuatorEndpoint {
    compute(): any {
        return {
            status: 'UP',
            details: {},
        };
    }
}
