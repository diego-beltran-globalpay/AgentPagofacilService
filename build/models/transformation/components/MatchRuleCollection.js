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
exports.MatchRuleCollection = void 0;
const MatchRule_1 = require("./MatchRule");
class MatchRuleCollection {
    constructor(matchRules) {
        this.matchRules = matchRules;
    }
    static fromFile(collection) {
        const result = [];
        for (const element of collection) {
            result.push(MatchRule_1.MatchRule.fromFile(element));
        }
        return new MatchRuleCollection(result);
    }
    static getPredefinedTrue() {
        return new MatchRuleCollection([]);
    }
    test(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.matchRules.length)
                return 0;
            for (const indexRule in this.matchRules) {
                const applied = yield this.matchRules[indexRule].test(contexts);
                if (applied)
                    return parseInt(indexRule);
            }
            return -1;
        });
    }
}
exports.MatchRuleCollection = MatchRuleCollection;
MatchRuleCollection.isInstanceOf = (value) => {
    return value instanceof Object && value.matchRules instanceof Array;
};
