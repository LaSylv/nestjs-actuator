import { Test, TestingModule } from "@nestjs/testing";
import { NestActuatorService } from "./nest-actuator.service";

describe("NestActuatorService", () => {
  let service: NestActuatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestActuatorService],
    }).compile();

    service = module.get<NestActuatorService>(NestActuatorService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
