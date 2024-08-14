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
exports.TransformationDelStep = void 0;
const types_1 = require("./types");
const TransformationGenStep_1 = require("./TransformationGenStep");
const MatchRuleCollection_1 = require("./MatchRuleCollection");
const TransfCtxAccessor_1 = require("../contexts/TransfCtxAccessor");
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
class TransformationDelStep extends TransformationGenStep_1.TransformationGenStep {
    constructor(fieldNameDest, matchRule) {
        super();
        this.fieldNameDest = fieldNameDest;
        this.accessor = TransfCtxAccessor_1.TransfCtxAccessorInst.getInstance();
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.matchRule = matchRule ? matchRule : MatchRuleCollection_1.MatchRuleCollection.getPredefinedTrue();
    }
    static fromFile(fieldNameDest, conditional) {
        return types_1.isInnerTransformationUnitJSON_1(conditional) || types_1.isInnerTransformationUnitJSON_2(conditional)
            ? new TransformationDelStep(fieldNameDest, MatchRuleCollection_1.MatchRuleCollection.fromFile(conditional.Match))
            : new TransformationDelStep(fieldNameDest);
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const ruleIndex = yield this.matchRule.test(contexts);
            if (ruleIndex !== -1) {
                this.logger.trace(`Deleting field ${this.fieldNameDest}`, { logPrefix });
                this.accessor.delete(this.fieldNameDest, contexts);
            }
        });
    }
}
exports.TransformationDelStep = TransformationDelStep;
