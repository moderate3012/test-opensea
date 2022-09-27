import { join } from "path";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { I18nJsonParser, I18nModule } from "nestjs-i18n";
import { APP_FILTER } from "@nestjs/core";
import { CacheModule, Module } from "@nestjs/common";

import configuration from "common/config/configuration";
import { I18nAllExceptionFilter } from "common/filters/i18n-all-exception.filter";

import { SharedModule } from "modules/shared/shared.module";
import { ConfigService } from "modules/shared/services/config.service";

import { AllExceptionsFilter } from "common/filters/all-exceptions.filter";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.mongoose,
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => configService.redisConfig,
      inject: [ConfigService],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        parserOptions: {
          path: join(__dirname, "/i18n/"),
          watch: configService.isDevelopment,
        },
      }),
      parser: I18nJsonParser,
      inject: [ConfigService],
    }),
    SharedModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: I18nAllExceptionFilter },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    // { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class MainModule {}
