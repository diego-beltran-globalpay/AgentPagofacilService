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
exports.TransformationFuncStep = void 0;
const TransformationGenStep_1 = require("./TransformationGenStep");
const MatchRuleCollection_1 = require("./MatchRuleCollection");
const TransfCtxAccessor_1 = require("../contexts/TransfCtxAccessor");
const functions_1 = require("../functions");
const SetError_1 = require("../functions/flow/SetError");
const basicFormat = new RegExp(/^(\w|\d){1,60}(\(.{1,256}\))?$/);
const paramsAndErrorFormat = new RegExp(/^((\w|\d){1,60}(\(.{1,256}\))%\w{1,256})$/);
const errorOnlyFormat = new RegExp(/^(\w|\d){1,60}(\(.{1,256}\))?$/);
class TransformationFuncStep extends TransformationGenStep_1.TransformationGenStep {
    constructor(rule, secParam, thirdParam) {
        super();
        this.rule = rule;
        this.accessor = TransfCtxAccessor_1.TransfCtxAccessorInst.getInstance();
        this.matchRule = MatchRuleCollection_1.MatchRuleCollection.getPredefinedTrue();
        if (SetError_1.SetError.isSetError(secParam)) {
            this.onErrorRule = secParam;
        }
        else if (MatchRuleCollection_1.MatchRuleCollection.isInstanceOf(secParam)) {
            this.matchRule = secParam;
            this.onErrorRule = thirdParam;
        }
    }
    static fromFile(functionString, conditional, resultParser, extFunctions) {
        let rule, matchRule, onErrorRule;
        const { functionName, functionParams: functParamsRaw, errorRuleName } = TransformationFuncStep.parseStringSignature(functionString);
        const functionParams = functParamsRaw.substr(0, functParamsRaw.length - 1);
        if (Object.keys(functions_1.functionsAvb).includes(functionName)) {
            if (errorRuleName)
                onErrorRule = SetError_1.SetError.buildFromString(errorRuleName);
            const functionClass = functions_1.functionsAvb[functionName];
            rule = functionClass.buildFromString(functionParams);
        }
        else if (extFunctions) {
            if (extFunctions[functionName]) {
                if (errorRuleName)
                    onErrorRule = SetError_1.SetError.buildFromString(errorRuleName);
                rule = new extFunctions[functionName](functionParams.split(","));
            }
            else {
                throw new Error(`This function ${functionName} is not supported`);
            }
        }
        else {
            throw new Error(`This function ${functionName} is not supported`);
        }
        if (typeof conditional === "string" || typeof conditional === "number" || typeof conditional === "boolean") {
            matchRule = MatchRuleCollection_1.MatchRuleCollection.getPredefinedTrue();
        }
        else {
            matchRule = MatchRuleCollection_1.MatchRuleCollection.fromFile(conditional.Match);
        }
        return new TransformationFuncStep(rule, matchRule, onErrorRule);
    }
    static parseStringSignature(functionString) {
        let functionName = "", functionParams = "", errorRuleName = "";
        if (basicFormat.test(functionString)) {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;
            [functionName, functionParams = ""] = functionString.split("(");
        }
        else if (paramsAndErrorFormat.test(functionString)) {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;
            [functionName, functionParams] = functionString.split("(");
            [functionParams, errorRuleName] = functionParams.split(")%");
        }
        else if (errorOnlyFormat.test(functionString)) {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;
            [functionName, errorRuleName] = functionString.split("%");
        }
        else {
            throw new Error(`This step ${functionString} is not well formatted`);
        }
        return { functionName, functionParams, errorRuleName };
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const ruleIndex = yield this.matchRule.test(contexts);
            if (ruleIndex !== -1) {
                if (this.onErrorRule)
                    this.onErrorRule.applySave(contexts);
                yield this.rule.applySave(contexts);
            }
        });
    }
}
exports.TransformationFuncStep = TransformationFuncStep;
