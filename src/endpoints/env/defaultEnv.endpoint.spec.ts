import {DefaultEnvEndpoint} from "./defaultEnv.endpoint";

describe('DefaultEnv Endpoint', function () {
  const endpoint = new DefaultEnvEndpoint();

  it('should return correctly formatted data', function () {
    const response = endpoint.compute();

    expect(response.activeProfiles).toHaveLength(0);
    expect(response.propertySources).toHaveLength(1);
  });

  it('should scrub secrets', function () {
    process.env.secret = 'secretKey';
    const response = endpoint.compute();

    expect(response.propertySources[0].properties['secret'].value).toBe('*****');
  });
});