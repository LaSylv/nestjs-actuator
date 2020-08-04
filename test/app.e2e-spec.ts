import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { ActuatorModule } from "./../src/actuator.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ActuatorModule.forRoot({})],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/actuator (GET)", () => {
    return request(app.getHttpServer())
      .get("/actuator")
      .expect(200, {
        _links: {
          self: { href: "/", templated: false },
          env: { href: "/env", templated: false },
          info: { href: "/info", templated: false },
          health: { href: "/health", templated: false },
          httptrace: { href: "/httptrace", templated: false },
          beans: { href: "/beans", templated: false },
        },
      });
  });

  it("/actuator/non-existing (GET)", () => {
    return request(app.getHttpServer())
      .get("/actuator/non-existing")
      .expect(404);
  });

  it("/actuator/env (GET)", () => {
    return request(app.getHttpServer()).get("/actuator/env").expect(200);
  });

  it("/actuator/httptrace (GET)", () => {
    return request(app.getHttpServer()).get("/actuator/httptrace").expect(200);
  });

  it("/actuator/health (GET)", () => {
    return request(app.getHttpServer()).get("/actuator/health").expect(200);
  });

  it("/actuator/info (GET)", () => {
    return request(app.getHttpServer()).get("/actuator/info").expect(200);
  });

  it("/actuator/beans (GET)", () => {
    return request(app.getHttpServer()).get("/actuator/beans").expect(200);
  });
});
