import { DefaultInfoEndpoint } from "./defaultInfo.endpoint";
import { Provider } from "@nestjs/common";
import { ACTUATOR_ENDPOINT_PREFIX } from "../../actuator.constant";

export default function getInfoEndpoint(): Provider {
  return {
    provide: ACTUATOR_ENDPOINT_PREFIX + "info",
    useClass: DefaultInfoEndpoint,
  };
}
