"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckSum = void 0;
const _1 = require(".");
const CheckSumAvb_1 = require("./CheckSumAvb");
class CheckSum {
    static get(type, opts) {
        switch (type) {
            case CheckSumAvb_1.CheckSumAvb.crc16:
                return new _1.Crc("crc16", opts);
            case CheckSumAvb_1.CheckSumAvb.crc32:
                return new _1.Crc("crc32", opts);
            case CheckSumAvb_1.CheckSumAvb.crc8:
                return new _1.Crc("crc8", opts);
            case CheckSumAvb_1.CheckSumAvb.none:
                return new _1.None();
            case CheckSumAvb_1.CheckSumAvb.lrc:
                return new _1.Lrc();
            default:
                throw new Error("Checksum type is not supported");
        }
    }
}
exports.CheckSum = CheckSum;
