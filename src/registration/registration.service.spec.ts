import { RegistrationService } from "./registration.service";
import { Test } from "@nestjs/testing";
import { HttpModule, HttpService } from "@nestjs/common";
import { ACTUATOR_MODULE_OPTIONS } from "../actuator.constant";
import { ActuatorModuleOptions } from "../actuator.module";
import { doesNotThrow } from "assert";
import { of, throwError } from "rxjs";
import { AxiosRequestConfig, AxiosResponse } from "axios";

describe("Registration Service", () => {
  let service: RegistrationService;
  let httpService: HttpService;

  beforeEach(async () => {
    let configuration: ActuatorModuleOptions = {
      registration: {
        serviceUrl: "serviceUrl",
        adminServerUrl: "serverUrl",
        name: "appName",
        auth: {
          username: "username",
          password: "password",
        },
        metadata: {
          custom: "metadata",
        },
      },
    };
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        RegistrationService,
        {
          provide: ACTUATOR_MODULE_OPTIONS,
          useValue: configuration,
        },
      ],
    }).compile();
    service = module.get<RegistrationService>(RegistrationService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should register on startup", () => {
    const spyInstance = jest
      .spyOn(service, "refreshRegistration")
      .mockImplementation(() => {});
    service.onApplicationBootstrap();
    expect(service.refreshRegistration).toHaveBeenCalledTimes(1);
  });

  it("should register on schedule", () => {
    const spyInstance = jest
      .spyOn(service, "refreshRegistration")
      .mockImplementation(() => {});
    service.cronRegistration();
    expect(service.refreshRegistration).toHaveBeenCalledTimes(1);
  });

  it("should unregister on shutdown", () => {
    const spyInstance = jest
      .spyOn(httpService, "delete")
      .mockImplementation(() => {
        return of();
      });
    service.beforeApplicationShutdown();
    expect(spyInstance).toHaveBeenCalledTimes(1);
  });

  describe("computeRegistration", () => {
    it("should compute registration", function () {
      const applicationRegistration = service.computeRegistration();
      expect(applicationRegistration).toHaveProperty("id", undefined);
      expect(applicationRegistration).toHaveProperty(
        "healthUrl",
        "serviceUrl/actuator/health"
      );
      expect(applicationRegistration).toHaveProperty(
        "managementUrl",
        "serviceUrl/actuator"
      );
      expect(applicationRegistration).toHaveProperty("name", "appName");
      expect(applicationRegistration).toHaveProperty(
        "serviceUrl",
        "serviceUrl"
      );
      expect(applicationRegistration).toHaveProperty("metadata.version");
    });

    it("should not crash if no registration registration", async () => {
      const module = await Test.createTestingModule({
        imports: [HttpModule],
        providers: [
          RegistrationService,
          {
            provide: ACTUATOR_MODULE_OPTIONS,
            useValue: {},
          },
        ],
      }).compile();
      service = module.get<RegistrationService>(RegistrationService);

      expect(service.computeRegistration()).toBeUndefined();
    });
  });

  describe("refreshRegistration", function () {
    it("should not throw exception to not stop cron/fail startup", function () {
      const spyInstance = jest
        .spyOn(httpService, "post")
        .mockImplementation(() => {
          return throwError("Unexpected failure");
        });
      doesNotThrow(() => service.refreshRegistration());
    });

    it("should do the correct call to register", function () {
      const okResponse: AxiosResponse = {
        config: undefined,
        data: {},
        headers: undefined,
        status: 201,
        statusText: "201",
      };

      const spyInstance = jest
        .spyOn(httpService, "post")
        .mockImplementation(
          (path: string, body: any, config: AxiosRequestConfig) => {
            expect(path).toEqual("serverUrl/instances");
            expect(config.auth).toBeDefined();
            expect(body).toBeDefined();
            expect(body.metadata.timestamp).toBeDefined();
            expect(body.metadata.custom).toEqual("metadata");
            return of(okResponse);
          }
        );
      service.refreshRegistration();
      expect(spyInstance).toHaveBeenCalledTimes(1);
    });
  });
});
