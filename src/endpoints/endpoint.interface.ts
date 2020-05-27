export interface ActuatorEndpoint<T> {
  compute(): T;
}
