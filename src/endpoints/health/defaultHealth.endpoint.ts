import { ActuatorEndpoint } from "../endpoint.interface";
import { ActuatorApplicationStatus } from "../../actuator.constant";

type Health = {
  status: ActuatorApplicationStatus;
  details: Record<string, unknown>;
};
/**
 * Default health endpoint.
 */
export class DefaultHealthEndpoint implements ActuatorEndpoint<Health> {
  compute(): Health {
    return {
      status: "UP",
      details: {},
    };
  }
}
