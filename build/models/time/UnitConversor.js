"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitConversor = void 0;
class UnitConversor {
    static toMs(amount, unit) {
        switch (unit) {
            case "m":
                return 60 * 1000 * amount;
            case "ms":
                return amount;
            case "s":
                return 1000 * amount;
        }
    }
    static toSecs(amount, unit) {
        switch (unit) {
            case "m":
                return amount * 60;
            case "ms":
                return amount / 1000;
            case "s":
                return amount;
        }
    }
}
exports.UnitConversor = UnitConversor;
