import { isEmail } from "class-validator";
import { sample } from "lodash";
import { Types } from "mongoose";

export const validateEmail = (address: string, fieldName: string) => {
  if (!isEmail(address)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

export const getRpcUrl = (rpcUrls: string[], isWss = false) => {
  return sample(rpcUrls.filter((o) => o.startsWith(isWss ? "wss" : "https")));
};

export const callTimeExecute = (startTime) => {
  const endTime = process.hrtime(startTime);
  return Math.round(endTime[0] * 1e3 + endTime[1] / 1e6);
};

export const parseDecimal = (result) => {
  if (!result.length) {
    return [];
  }
  const keys = [];
  for (const [key, value] of Object.entries(result[0])) {
    if (value instanceof Types.Decimal128) {
      keys.push(key);
    }
  }
  if (keys.length) {
    result.forEach((doc) => {
      keys.forEach((key) => {
        doc[key] = doc[key].toString();
      });
    });
  }
  return result;
};

export const parseJSON = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
};
