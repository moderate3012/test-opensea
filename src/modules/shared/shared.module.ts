import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "./services/config.service";
import { GeneratorService } from "./services/generator.service";
import { ValidatorService } from "./services/validator.service";
import { ConfigModule } from "@nestjs/config";
import { BinanceService } from "./services/bot-binance";
import { TestOpenSeaService } from "./services/test-opensea";

const providers = [
  GeneratorService,
  ValidatorService,
  ConfigService,
  // BinanceService,
  TestOpenSeaService
];

@Global()
@Module({
  imports: [HttpModule, ConfigModule],
  providers,
  exports: [...providers, HttpModule],
})
export class SharedModule { }
