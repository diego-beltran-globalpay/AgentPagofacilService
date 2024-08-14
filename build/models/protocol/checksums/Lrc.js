"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lrc = void 0;
const CheckSumModel_1 = require("./CheckSumModel");
class Lrc extends CheckSumModel_1.CheckSumModel {
    constructor() {
        super(...arguments);
        this.length = 1;
    }
    calculate(source) {
        let lrcResult = 0, result = "00";
        for (let i = 1; i < source.length; i++)
            lrcResult ^= source.slice(i, i + 1)[0];
        result = lrcResult.toString(16);
        if (result.length % 2)
            result = "0" + result;
        return result;
    }
}
exports.Lrc = Lrc;
