"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexOperator = void 0;
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
class RegexOperator {
    constructor(regex, isNegated = false) {
        this.regex = regex;
        this.isNegated = isNegated;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
    }
    apply(value, options = {}) {
        const { logPrefix } = options;
        const isRegexPassed = this.regex.test(value);
        this.logger.trace(`[ RegexOperator ] - Applying regex: ${this.regex} - Is Negative: ${this.isNegated} - Value: ${value}`, { logPrefix });
        const result = (!this.isNegated && isRegexPassed) || (this.isNegated && !isRegexPassed);
        this.logger.trace(`[ RegexOperator ] - Regex result: ${result}`, { logPrefix });
        return result;
    }
}
exports.RegexOperator = RegexOperator;
