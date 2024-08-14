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
exports.MatchRule = void 0;
const MatchStep_1 = require("./MatchStep");
class MatchRule {
    constructor(matchRules) {
        this.matchRules = matchRules;
    }
    static fromFile(collection) {
        const result = [];
        for (const key in collection)
            result.push(new MatchStep_1.MatchStep(key, new RegExp(collection[key])));
        return new MatchRule(result);
    }
    test(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.matchRules.length)
                return true;
            let result = true;
            for (const index in this.matchRules) {
                const stepResult = yield this.matchRules[index].test(contexts);
                result = result && stepResult;
            }
            return result;
        });
    }
}
exports.MatchRule = MatchRule;
