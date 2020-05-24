
<h1 align="center">Nestjs Actuator</h1>

<p align="center">A module to monitor your <a href="https://github.com/nestjs/nest">Nestjs</a> applications.</p>
<br/>
<p align="center">
    <img alt="GitHub" src="https://img.shields.io/github/license/glosur/nestjs-actuator">
    <img alt="npm" src="https://img.shields.io/npm/v/@glosur/nestjs-actuator">
    <a href="https://cloud.drone.io/Glosur/nestjs-actuator">
        <img src="https://cloud.drone.io/api/badges/Glosur/nestjs-actuator/status.svg" />
    </a>
    <a href="https://codeclimate.com/github/Glosur/nestjs-actuator/maintainability">
        <img src="https://api.codeclimate.com/v1/badges/b4a9985f26bfb6b4250d/maintainability" />
    </a>
    <a href="https://codecov.io/gh/Glosur/nestjs-actuator">
      <img src="https://codecov.io/gh/Glosur/nestjs-actuator/branch/master/graph/badge.svg" />
    </a>
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/glosur/nestjs-actuator">
</p>

## Description

Nestjs-actuator is a [NestJS](https://nestjs.com/) module (Typescript) implementation of the [Spring Actuator API](https://docs.spring.io/spring-boot/docs/current/actuator-api/html/#info) .
 
This project was inspired by [Pyctuator](https://github.com/SolarEdgeTech/pyctuator).
 
This module aims to register and monitor NestJS application through [Spring Boot Admin](https://github.com/codecentric/spring-boot-admin).
However, this module can also be used just to expose the endpoints provided.

The project come with only one hard dependency, `@nestjs/schedule` which might be removed in the future.

## Installation

```bash
$ npm install --save @glosur/nestjs-actuator
```

## How to use

Import `ActuatorModule` into the root `ApplicationModule`

```typescript
import { Module } from '@nestjs/common';
import {ActuatorModule} from "./actuator.module";

@Module({
  imports: [
    ActuatorModule.forRoot({
                    registration : {
                       adminServerUrl: 'http://localhost:8080', // URL of the spring boot admin server
                       name: 'myApp', // Name of your app
                       serviceUrl: 'http://localhost:3000', // URL to register with to Spring Boot Admin. This is what Spring Boot Admin will try to call to fetch informations.
                       auth: { // Optional, needed if you secured your Spring Boot Admin Server
                          "username": "username",
                          "password": "pwd"
                       },
                       metadata: {} // Optional, additionals metadata
                   }
                }),
    ]
})
export class ApplicationModule {}
```

### Supported SBA features
* **Version:** Display the version of the app
* **Environment:** Display environment variables (Hiding sensible ones)
* **Http traces:** Display the last 100 http calls to your application

More to come !

## Actuator Endpoints security

This project does not provide any security on the exposed endpoints. Apply a middleware to `/actuator` to protect it. 
However make sure to make the Spring Boot Admin Server aware of those security concerns through metadata.


## Compatibility version

This module has only be tested againt NestJS 7+. It *might* work with lower versions.

## Known caveats

Due to how works interceptors in NestJS, some calls can't be seen in the Http Traces tab. Those calls are the one not mapped to any route.
Also, exception filters getting triggered after interceptors means the status code can sometimee be missing

## License

MIT licensed
