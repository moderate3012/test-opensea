import { Injectable } from "@nestjs/common";
import Binance from 'node-binance-api';
import { ConfigService } from "./config.service";
import { RSIService } from "./rsi.service";

@Injectable()
export class BinanceService {
  private readonly binance;
  private data = [];
  constructor(
    private readonly configService: ConfigService
  ) {
    this.binance = new Binance().options({
      APIKEY: this.configService.binanceKey.apiKey,
      APISECRET: this.configService.binanceKey.secretKey
    });
    void this.setLeverage()
    this.binance.futuresMarkPriceStream('ETHUSDT', async (res) => {
      if (this.data.length == 10) {
        const rsi = new RSIService(this.data, 10);
        const result = await rsi.calculate();
        console.info(result);
        this.data.splice(0, 1);
      }
      this.data.push(res.markPrice);
    });
  }

  async setLeverage() {
    try {
      const res = await this.binance.futuresLeverage('ETHUSDT', 20);
      console.info("===============> START BOT <===================")
      console.info("<=============================================>")
      if (res) {
        console.info("==> Set leverage success")
      }
    } catch (e) {
      console.info("Error: ", e)
    }
  }

}
