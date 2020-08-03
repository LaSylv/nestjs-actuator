import { HttptraceInterceptor } from "./httptrace.interceptor";
import { ExecutionContext } from "@nestjs/common";

describe("HttpTraceInterceptor", function () {
  const traceRepositoryMock = {
    addTrace: jest.fn(),
    getTraces: jest.fn(),
  };

  const interceptor = new HttptraceInterceptor(traceRepositoryMock);

  const executionContext = ({
    // Self return so we don't have a big chain of nested mocks
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
    getResponse: jest.fn(),
  } as unknown) as ExecutionContext;

  it("should not do anything if not http context", () => {
    (executionContext.switchToHttp()
      .getRequest as jest.Mock).mockReturnValueOnce({});

    (executionContext.switchToHttp()
      .getResponse as jest.Mock).mockReturnValueOnce({});

    interceptor.addHttptrace(executionContext, 250);

    expect(traceRepositoryMock.addTrace).toBeCalledTimes(0);
  });
});
