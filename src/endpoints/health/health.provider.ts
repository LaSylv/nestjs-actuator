import {DefaultHealthEndpoint} from "./defaultHealth.endpoint";
import {Provider} from "@nestjs/common";
import {ACTUATOR_ENDPOINT_PREFIX} from "../../actuator.constant";


export default function getHealthEndpoint(): Provider {
    return {
        provide: ACTUATOR_ENDPOINT_PREFIX + 'health',
        useClass: DefaultHealthEndpoint
    };
}