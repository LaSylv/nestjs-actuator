import { Test } from "@nestjs/testing";
import {
  HttptraceRepository,
  InMemoryHttpTraceRepository,
} from "./httptrace.repository";

function getDefaultTrace() {
  return {
    request: { headers: undefined, method: "", uri: "" },
    response: { headers: undefined, status: 0 },
    timeTaken: 0,
    timestamp: 0,
  };
}

describe("InMemoryHttpTraceRepository", function () {
  let repository: HttptraceRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: HttptraceRepository,
          useClass: InMemoryHttpTraceRepository,
        },
      ],
    }).compile();
    repository = module.get<HttptraceRepository>(HttptraceRepository);
  });

  it("should add element when first one", function () {
    repository.addTrace(getDefaultTrace());

    expect(repository.getTraces()).toHaveLength(1);
  });

  it("should never have more than 100 elements", function () {
    for (let i = 0; i < 135; i++) {
      repository.addTrace({
        request: { headers: undefined, method: "", uri: "" },
        response: { headers: undefined, status: 0 },
        timeTaken: 0,
        timestamp: 0,
      });
    }

    expect(repository.getTraces()).toHaveLength(100);
  });
});
