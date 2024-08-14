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
exports.TransformationAddStep = void 0;
const TransformationGenStep_1 = require("./TransformationGenStep");
const MatchRuleCollection_1 = require("./MatchRuleCollection");
const TransformationRuleCollection_1 = require("./TransformationRuleCollection");
const functions_1 = require("../functions");
const TransfCtxAccessor_1 = require("../contexts/TransfCtxAccessor");
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const types_1 = require("./types");
const SetError_1 = require("../functions/flow/SetError");
class TransformationAddStep extends TransformationGenStep_1.TransformationGenStep {
    constructor(fieldNameDest, resultParser, wildcar1, wildcar2, wildcard3) {
        super();
        this.fieldNameDest = fieldNameDest;
        this.resultParser = resultParser;
        this.accessor = TransfCtxAccessor_1.TransfCtxAccessorInst.getInstance();
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.onErrorRule = null;
        this.fieldNameDest = fieldNameDest;
        this.resultParser = resultParser;
        this.matchRule = MatchRuleCollection_1.MatchRuleCollection.getPredefinedTrue();
        if (MatchRuleCollection_1.MatchRuleCollection.isInstanceOf(wildcar1)) {
            this.matchRule = wildcar1;
        }
        else if (typeof wildcar1 === "string" || typeof wildcar1 === "number" || typeof wildcar1 === "boolean") {
            this.fixedValue = wildcar1;
        }
        else {
            this.rule = wildcar1;
        }
        if (SetError_1.SetError.isSetError(wildcar2)) {
            this.onErrorRule = wildcar2;
        }
        else if (TransformationRuleCollection_1.TransformationRuleCollection.isInstanceOf(wildcar2)) {
            this.transformationRules = wildcar2;
        }
        if (wildcard3)
            this.onErrorRule = wildcard3;
    }
    static fromFile(fieldNameDest, conditional, resultParser, extFunctions) {
        let rule, matchRule, onErrorRule, transformationRules, fixedValue;
        const functionNamesAvb = Object.keys(functions_1.functionsAvb);
        if (types_1.isInnerTransformationUnitJSON_1(conditional) || types_1.isInnerTransformationUnitJSON_2(conditional)) {
            if (!conditional.Rule)
                throw new Error(`Inner transformaton unit need a Rule array for this step ${fieldNameDest}`);
            matchRule = MatchRuleCollection_1.MatchRuleCollection.fromFile(conditional.Match);
            transformationRules = TransformationRuleCollection_1.TransformationRuleCollection.fromFile(conditional.Rule, extFunctions);
            return new TransformationAddStep(fieldNameDest, resultParser, matchRule, transformationRules);
        }
        else if (typeof conditional === "string") {
            if (conditional[0] === "@") {
                // eslint-disable-next-line prefer-const
                let [functionName, functionParams = ""] = conditional.substr(1).split("(");
                functionParams = functionParams.substr(0, functionParams.length - 1);
                if (functionNamesAvb.includes(functionName)) {
                    const tmp = functions_1.functionsAvb[functionName];
                    if (functionParams.indexOf(")%") > -1) {
                        const errorRuleName = functionParams.split(")%")[1];
                        onErrorRule = SetError_1.SetError.buildFromString(errorRuleName);
                    }
                    rule = tmp.buildFromString(functionParams);
                }
                else if (extFunctions) {
                    if (extFunctions[functionName]) {
                        if (functionParams.indexOf(")%") > -1) {
                            const errorRuleName = functionParams.split(")%")[1];
                            onErrorRule = SetError_1.SetError.buildFromString(errorRuleName);
                        }
                        rule = new extFunctions[functionName](functionParams.split(","));
                    }
                }
                if (!rule)
                    throw new Error(`This function ${functionName} is not supported`);
                return new TransformationAddStep(fieldNameDest, resultParser, rule, onErrorRule);
            }
            else {
                fixedValue = conditional;
                return new TransformationAddStep(fieldNameDest, resultParser, fixedValue, onErrorRule);
            }
        }
        else if (typeof conditional === "number" || typeof conditional === "boolean") {
            fixedValue = conditional;
            return new TransformationAddStep(fieldNameDest, resultParser, fixedValue);
        }
        else {
            throw new Error(`Invalid value type ${typeof conditional} for this step ${fieldNameDest}`);
        }
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const matchRuleIndex = yield this.matchRule.test(contexts);
            if (matchRuleIndex !== -1) {
                let value;
                if (this.onErrorRule)
                    this.onErrorRule.applySave(contexts);
                if (this.transformationRules)
                    value = yield this.transformationRules.rules[matchRuleIndex].apply(contexts);
                else if (this.rule)
                    value = yield this.rule.applyReturn(contexts);
                else if (this.fixedValue !== undefined && this.fixedValue !== null) {
                    value = this.fixedValue;
                    if (this.accessor.isContextRef(this.fixedValue.toString()))
                        value = yield this.accessor.get(this.fixedValue.toString(), contexts);
                }
                if (value !== undefined && value !== null) {
                    value = this.resultParser.parse(value, logPrefix);
                    this.logger.trace(`Adding the value [${value}] to the field [${this.fieldNameDest}]`, { logPrefix });
                    yield this.accessor.set(this.fieldNameDest, value, contexts);
                }
                else {
                    this.logger.trace(`No value found to add to the field [${this.fieldNameDest}]`, { logPrefix });
                }
            }
        });
    }
}
exports.TransformationAddStep = TransformationAddStep;
