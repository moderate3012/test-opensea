import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import morgan from "morgan";
import setupSwagger from "./swagger";
import { SharedModule } from "modules/shared/shared.module";
import { ConfigService } from "./modules/shared/services/config.service";
import { MainModule } from "main.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SWAGGER_API_ROOT } from "swagger/constants";

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);
  app.use(helmet());
  app.use(morgan("combined"));

  const configService = app.select(SharedModule).get(ConfigService);

  if (configService.isEnableSwagger) {
    setupSwagger(app);
  }
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(configService.port);

  console.info(
    `server running on http://localhost:${configService.port}/${SWAGGER_API_ROOT}`
  );
}
void bootstrap();
