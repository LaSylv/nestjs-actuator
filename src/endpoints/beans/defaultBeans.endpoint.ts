import { ActuatorEndpoint } from "../endpoint.interface";
import { Inject, Scope } from "@nestjs/common";
import { ACTUATOR_MODULE_OPTIONS } from "../../actuator.constant";
import { ActuatorModuleOptions } from "../../actuator.module";
import { ModulesContainer } from "@nestjs/core";

type Bean = {
  aliases: string[];
  scope: string;
  type: string;
  resource?: string;
  dependencies: string[];
};

type ModuleBeans = {
  beans: {
    [key: string]: Bean;
  };
};

type GetConstructorArgs<T> = T extends new (...args: infer U) => any
  ? U
  : never;

//           "dependencies" : [ ]
type Beans = {
  contexts: {
    [key: string]: ModuleBeans;
  };
};
export class DefaultBeansEndpoint implements ActuatorEndpoint<Beans> {
  constructor(
    @Inject(ACTUATOR_MODULE_OPTIONS)
    private readonly options: ActuatorModuleOptions,
    private readonly modulesContainer: ModulesContainer
  ) {}

  compute(): Beans {
    const returnValue: Beans = {
      contexts: {},
    };
    this.modulesContainer.forEach((module) => {
      const beansForAModule: ModuleBeans = {
        beans: {},
      };

      const strings = [...module.imports.values()].map((m) => m.metatype.name);

      // module.getProviderByKey()
      [...module.controllers.keys(), ...module.providers.keys()]
        .map((k) => module.getProviderByKey(k))
        .forEach((c) => {
          if (!c) {
            return;
          }

          beansForAModule.beans[c.name] = {
            aliases: [],
            scope: Scope[c.scope] ? Scope[c.scope] : "UNKNOWN",
            type: c.instance?.constructor.name,
            dependencies: [...new Set(strings)],
          };
        });

      returnValue.contexts[module.metatype.name] = beansForAModule;
    });
    return returnValue;
  }
}
