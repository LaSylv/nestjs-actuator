import { ActuatorEndpoint } from "../endpoint.interface";

const scrubbingRegex = /^.*key.*|.*secret.*|.*password.*|.*token.*/;

type Environment = {
  activeProfiles: string[];
  propertySources: { name: string; properties: Record<string, unknown> }[];
};

export class DefaultEnvEndpoint implements ActuatorEndpoint<Environment> {
  compute(): Environment {
    const properties = {};
    Object.keys(process.env).forEach((key) => {
      properties[key] = {
        value: DefaultEnvEndpoint.scrubSecret(key, process.env[key]),
      };
    });
    return {
      // needed to not crash SBA interface
      activeProfiles: [],
      propertySources: [
        {
          name: "systemEnvironment",
          properties: properties,
        },
      ],
    };
  }

  private static scrubSecret(key: string, value: string): string {
    return scrubbingRegex.test(key.toLocaleLowerCase()) ? "*****" : value;
  }
}
