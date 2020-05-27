export const ACTUATOR_MODULE_OPTIONS = "ActuatorModuleOptions";
export const ACTUATOR_ENDPOINT_PREFIX = "ActuatorEndpoint_";
export const ACTUATOR_AVAILABLE_ENDPOINTS = "AvailableEndpoints";

export type ActuatorApplicationStatus =
  | "UNKNOWN"
  | "OUT_OF_SERVICE"
  | "UP"
  | "DOWN"
  | "OFFLINE"
  | "RESTRICTED";
