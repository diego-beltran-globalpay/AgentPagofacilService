"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchStep = void 0;
const TransfCtxAccessor_1 = require("../contexts/TransfCtxAccessor");
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
class MatchStep {
    constructor(fieldNameSource, regex) {
        this.fieldNameSource = fieldNameSource;
        this.regex = regex;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.accessor = TransfCtxAccessor_1.TransfCtxAccessorInst.getInstance();
        this.isNegated = false;
        const negatedRef = fieldNameSource.substr(2, 2);
        if (negatedRef == "!N") {
            this.isNegated = true;
            this.fieldNameSource = this.fieldNameSource.substr(0, 2) + this.fieldNameSource.substr(4);
        }
    }
    test(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const value = yield this.accessor.get(this.fieldNameSource, contexts);
            const isRegexPassed = this.regex.test(value);
            this.logger.trace(`[ MatchStep ] - Applying regex: ${this.regex} - Is Negative: ${this.isNegated} - Field Num: ${this.fieldNameSource} - Value: ${value}`, { logPrefix });
            const result = (!this.isNegated && isRegexPassed) || (this.isNegated && !isRegexPassed);
            this.logger.trace(`[ MatchStep ] - Regex result: ${result}`, { logPrefix });
            return result;
        });
    }
}
exports.MatchStep = MatchStep;
