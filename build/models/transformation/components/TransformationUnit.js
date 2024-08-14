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
exports.TransformationUnit = void 0;
const MatchRuleCollection_1 = require("./MatchRuleCollection");
const TransformationRuleCollection_1 = require("./TransformationRuleCollection");
class TransformationUnit {
    constructor(matchRules, transformationRules) {
        this.matchRules = matchRules;
        this.transformationRules = transformationRules;
        if (matchRules.matchRules.length !== transformationRules.rules.length) {
            if (transformationRules.rules.length > 1) {
                throw new Error("The match rules qty is not equal to transformation step.");
            }
        }
    }
    static fromObject(statement, extFunctions) {
        return new TransformationUnit(MatchRuleCollection_1.MatchRuleCollection.fromFile(statement.Match), TransformationRuleCollection_1.TransformationRuleCollection.fromFile(statement.Rule, extFunctions));
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRuleIndex = yield this.matchRules.test(contexts);
            if (matchRuleIndex !== -1) {
                if (this.transformationRules.rules.length === 1)
                    yield this.transformationRules.apply(0, contexts);
                else
                    yield this.transformationRules.apply(matchRuleIndex, contexts);
                return { ruleIndex: matchRuleIndex, applied: true };
            }
            return { ruleIndex: -1, applied: false };
        });
    }
    directApply(contexts, ruleIndex = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transformationRules.apply(ruleIndex, contexts);
            return { ruleIndex, applied: true };
        });
    }
}
exports.TransformationUnit = TransformationUnit;
