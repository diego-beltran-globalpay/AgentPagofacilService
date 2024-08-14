"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.None = void 0;
const CheckSumModel_1 = require("./CheckSumModel");
class None extends CheckSumModel_1.CheckSumModel {
    constructor() {
        super(...arguments);
        this.length = 0;
    }
    calculate(source) {
        return "";
    }
}
exports.None = None;
