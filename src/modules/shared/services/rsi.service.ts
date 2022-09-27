import { Injectable } from "@nestjs/common";
import Big from "big.js";

@Injectable()
export class RSIService {
    private readonly values;
    private readonly data;
    private readonly period;
    constructor(values, period) {
        this.values = values.reverse();
        this.data = [];
        this.period = period;
    }

    async calculate() {
        await this.lossOrGain();
        await this.averageGain();
        await this.averageLoss();
        await this.calculateRS();
        await this.calculateRSI();
        return this.data;
    }

    async lossOrGain() {
        await Promise.all(
            this.values.map((val, idx) => {
                if (idx > 0) {
                    const prevVal = this.values[idx - 1];
                    const change = Big(val).sub(prevVal);
                    this.data.push({
                        value: val,
                        change: change.toNumber(),
                        gain: (change.toNumber() > 0) ? change.toNumber() : 0,
                        loss: (change.toNumber() < 0) ? change.abs().toNumber() : 0
                    });
                } else {
                    this.data.push({
                        value: val,
                        gain: 0,
                        loss: 0,
                        change: 0
                    })
                }
            })
        );
    }

    async averageGain() {
        await this.getAverages('gain')
    }

    async averageLoss() {
        await this.getAverages('loss')
    }

    async getAverages(key) {
        let sum = new Big(0);
        let avg = new Big(0);
        let overallAvg = new Big(0);
        const upperCaseKey = key.charAt(0).toUpperCase() + key.substr(1);
        await Promise.all(
            this.data.map((val, idx) => {
                if (idx < this.period) {
                    sum = sum.plus(val[key]);
                } else if (idx === this.period) {
                    sum = sum.plus(val[key]);
                    avg = sum.div(this.period);
                    this.data[idx][`avg${upperCaseKey}`] =
                        avg.toNumber();
                } else {
                    overallAvg =
                        Big(this.data[idx - 1][`avg${upperCaseKey}`]).mul(this.period - 1)
                            .plus(val[key])
                            .div(this.period);
                    this.data[idx][`avg${upperCaseKey}`] =
                        overallAvg.toNumber();
                }
            })
        );
    }

    async calculateRS() {
        await Promise.all(
            this.data.map((val,) => {
                if (val.avgGain !== undefined && val.avgLoss !== undefined &&
                    !isNaN(parseFloat(val.avgGain)) && !isNaN(parseFloat(val.avgLoss))) {
                        this.data.val.rs = Big(val.avgGain).div(val.avgLoss).toNumber();
                }
            })
        )
    }

    async calculateRSI() {
        await Promise.all(
            this.data.map((val, idx) => {
                if (val.avgLoss) {
                    this.data[idx].rsi = Big(100).sub(Big(100).div(Big(1).add(val.rs))).toNumber();
                } else if (val.rs != undefined) {
                    this.data[idx].rsi = 100;
                }
            })           
        )
    }

}
