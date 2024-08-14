"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericParser = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
class GenericParser {
    constructor() {
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
    }
}
exports.GenericParser = GenericParser;
