"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessThan = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
class LessThan {
    constructor() {
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
    }
    compare(value1, value2, options = {}) {
        const { logPrefix } = options;
        this.logger.trace(`[ LessThan ] - Applying comparison between value [${value1}] and [${value2}]`, { logPrefix });
        return value1 < value2;
    }
}
exports.LessThan = LessThan;
