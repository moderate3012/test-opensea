import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ConfigService } from "modules/shared/services/config.service";

@Injectable()
export class DateService {
  constructor(private configService: ConfigService) {}

  getThisDay = (blockTime?: number) => {
    const duration = 1;
    const { hours } = this.configService.governmentConfig;
    const currentTime = moment.utc(blockTime);
    const lastWeek = moment(currentTime).startOf("day").add(hours, "h");

    if (currentTime < lastWeek) {
      lastWeek.subtract(1, "d");
    }
    const last2Week = moment(lastWeek).subtract(duration, "d");
    const thisWeek = moment(lastWeek).add(duration, "d");
    const nextWeek = moment(thisWeek).add(duration, "d");

    return {
      last2Week: last2Week.unix(),
      lastWeek: lastWeek.unix(),
      thisWeek: thisWeek.unix(),
      nextWeek: nextWeek.unix(),
    };
  };

  getThisWeek(blockTime?: number) {
    const duration = 7;
    const { weekdays, hours } = this.configService.governmentConfig;
    if (weekdays == 0) return this.getThisDay(blockTime);
    const currentTime = moment.utc(blockTime);
    const numberCount = (weekdays - 2) % duration;
    const lastWeek = moment(currentTime).startOf("week").add(hours, "h");
    const isSunday = lastWeek.format("dddd") === "Sunday";
    if (isSunday) {
      lastWeek.add(1, "d");
    }
    lastWeek.add(numberCount, "d");

    if (currentTime < lastWeek) {
      lastWeek.subtract(duration, "d");
    }
    const last2Week = moment(lastWeek).subtract(duration, "d");
    const thisWeek = moment(lastWeek).add(duration, "d");
    const nextWeek = moment(thisWeek).add(duration, "d");

    return {
      last2Week: last2Week.unix(),
      lastWeek: lastWeek.unix(),
      thisWeek: thisWeek.unix(),
      nextWeek: nextWeek.unix(),
    };
  }
}
