import { Module } from "@nestjs/common";
import { NestActuatorService } from "./nest-actuator.service";

@Module({
  providers: [NestActuatorService],
  exports: [NestActuatorService],
})
export class NestActuatorModule {}
