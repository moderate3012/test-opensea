import { CacheModuleOptions, Injectable } from "@nestjs/common";
import { isNil } from "lodash";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import redisStore from "cache-manager-redis-store";
import { IListContract } from "common/interfaces/common.interface";

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  get isTest(): boolean {
    return this.nodeEnv === "test";
  }

  get nodeEnv(): string {
    return this.getString("node_env");
  }

  get isEnableSwagger(): boolean {
    return this.getBoolean("swagger");
  }

  get isEnableDebugger(): boolean {
    return this.getBoolean("debugger");
  }

  get port(): number {
    return this.getNumber("port_env");
  }

  get fallbackLanguage(): string {
    return this.getString("fallback_language").toLowerCase();
  }

  get jwt() {
    return {
      secret: this.getString("jwt.secret_key"),
      accessExpirationMinutes: this.getNumber("jwt.expiration_time"),
      refreshExpirationDays: this.getNumber("jwt.expiration_time"),
      resetPasswordExpirationMinutes: this.getNumber("jwt.expiration_time"),
      verifyEmailExpirationMinutes: this.getNumber("jwt.expiration_time"),
    };
  }

  get binanceKey() {
    return {
      apiKey:  this.getString("binance.api_key"),
      secretKey:  this.getString("jwt.secret_key"),
    }
  }

  get mongoose(): MongooseModuleOptions {
    return {
      uri: this.getString("mongodb.uri"),
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      connectionFactory: (connection) => {
        connection.plugin(mongoosePaginate);
        connection.plugin(aggregatePaginate);
        return connection;
      },
    };
  }

  get redisConfig(): CacheModuleOptions {
    return {
      store: redisStore,
      url: this.getString("redis.uri"),
      prefix: `goen_api_${this.nodeEnv}_`,
    };
  }

  get graphNodeUrl(): string {
    return this.getString("graph_node_url");
  }

  get venusUrl(): string {
    return this.getString("venus_url");
  }

  get coingeckoUrl(): string {
    return this.getString("coingecko_url");
  }

  get pancakeUrl(): string {
    return this.getString("pancake_url");
  }

  get getSpaceGraphQL(): string {
    return this.getString("graphql.space");
  }

  get getSourcePancake(): string {
    return this.getString("pancake_source_url");
  }

  get governmentConfig() {
    return {
      weekdays: this.getNumber("government.weekdays"),
      hours: this.getNumber("government.hours"),
    };
  }

  get reward_goen() {
    return {
      start_block: this.getNumber("reward_goen.start_block"),
      staking: this.getNumber("reward_goen.staking"),
      farming: this.getNumber("reward_goen.farming"),
    };
  }

  get next_week_goen_emission() {
    return this.getNumber("next_week_goen_emission");
  }

  get contract() {
    return {
      airdrop: this.getString("contract.airdrop"),
      apr: Object(this.get("contract.apr")),
      factory: Object(this.get("contract.factory")),
      token: Object(this.get("contract.token")) as IListContract,
      staking: Object(this.get("contract.staking")) as IListContract,
      farming: Object(this.get("contract.farming")) as IListContract,
      deprecated: Object(this.get("contract.deprecated")) as IListContract,
      government: Object(this.get("contract.government")),
      rebate: Object(this.get("contract.rebate")) as IListContract,
      goen_schedule: this.get("contract.goen_schedule"),
    };
  }

  private get(key: string): string {
    const value = this.configService.get(key);

    if (isNil(value)) {
      throw new Error(key + " environment variable does not set");
    }

    return value;
  }
  get blockPerSync(): number {
    return 3000;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + " env var is not a boolean");
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, "\n");
  }

  get timeCacheData(): number {
    return 60 * 60;
  }
}
