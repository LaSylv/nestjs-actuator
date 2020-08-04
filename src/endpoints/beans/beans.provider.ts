import { Provider } from "@nestjs/common";
import { ACTUATOR_ENDPOINT_PREFIX } from "../../actuator.constant";
import { DefaultBeansEndpoint } from "./defaultBeans.endpoint";

export default function getBeansEndpoint(): Provider {
  return {
    provide: ACTUATOR_ENDPOINT_PREFIX + "beans",
    useClass: DefaultBeansEndpoint,
  };
}
