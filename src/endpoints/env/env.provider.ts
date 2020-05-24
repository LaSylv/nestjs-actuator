import {DefaultEnvEndpoint} from "./defaultEnv.endpoint";
import {Provider} from "@nestjs/common";
import {ACTUATOR_ENDPOINT_PREFIX} from "../../actuator.constant";


export default function getEnvEndpoint(): Provider {
    return {
        provide: ACTUATOR_ENDPOINT_PREFIX + 'env',
        useClass: DefaultEnvEndpoint
    };
}