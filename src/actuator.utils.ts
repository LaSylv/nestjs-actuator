import { HealthCheckResult } from "@nestjs/terminus";
import {
  ActuatorApplicationStatus,
  ActuatorHealthType,
} from "./actuator.constant";

export function convertTerminusToActuator(
  terminusResult: HealthCheckResult
): ActuatorHealthType {
  let actuatorStatus: ActuatorApplicationStatus;
  switch (terminusResult.status) {
    case "ok":
      actuatorStatus = "UP";
      break;
    case "shutting_down":
      actuatorStatus = "OUT_OF_SERVICE";
      break;
    case "error":
      actuatorStatus = "DOWN";
      break;
  }
  return {
    status: actuatorStatus,
    details: terminusResult.details,
  };
}
