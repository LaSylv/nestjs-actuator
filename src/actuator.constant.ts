export const ACTUATOR_MODULE_OPTIONS = "ActuatorModuleOptions";
export const ACTUATOR_ENDPOINTS = "ActuatorEndpoints";

export type ActuatorApplicationStatus =
  | "UNKNOWN"
  | "OUT_OF_SERVICE"
  | "UP"
  | "DOWN"
  | "OFFLINE"
  | "RESTRICTED";

export interface ActuatorHealthType {
  // Statuses Spring Boot Admin understand
  status: ActuatorApplicationStatus;
  details: any;
}
