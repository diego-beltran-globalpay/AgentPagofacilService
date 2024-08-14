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
exports.TransformationRule = void 0;
const TransformationAddStep_1 = require("./TransformationAddStep");
const TransformationDelStep_1 = require("./TransformationDelStep");
const TransformationFuncStep_1 = require("./TransformationFuncStep");
const valueParsers_1 = require("../valueParsers");
var StepTypeSymbol;
(function (StepTypeSymbol) {
    StepTypeSymbol["Add"] = "+";
    StepTypeSymbol["Cond"] = "?";
    StepTypeSymbol["Del"] = "-";
    StepTypeSymbol["Func"] = "@";
})(StepTypeSymbol || (StepTypeSymbol = {}));
const stepTypeCreator = {
    ["+"]: TransformationAddStep_1.TransformationAddStep,
    ["?"]: TransformationAddStep_1.TransformationAddStep,
    ["-"]: TransformationDelStep_1.TransformationDelStep,
    ["@"]: TransformationFuncStep_1.TransformationFuncStep,
};
var ResultTypeSymbol;
(function (ResultTypeSymbol) {
    ResultTypeSymbol["Integer"] = "i";
    ResultTypeSymbol["Boolean"] = "b";
    ResultTypeSymbol["Float"] = "f";
    ResultTypeSymbol["Decimal"] = "d";
    ResultTypeSymbol["String"] = "s";
    ResultTypeSymbol["Transparent"] = "t";
})(ResultTypeSymbol || (ResultTypeSymbol = {}));
const resultTypeCreator = {
    ["b"]: valueParsers_1.BooleanParser,
    ["f"]: valueParsers_1.FloatParser,
    ["d"]: valueParsers_1.FloatParser,
    ["i"]: valueParsers_1.IntegerParser,
    ["s"]: valueParsers_1.StringParser,
    ["t"]: valueParsers_1.TransparentParser,
};
class TransformationRule {
    constructor(transformationSteps) {
        this.transformationSteps = transformationSteps;
        this.apply = (contexts, startFrom, endTo) => TransformationRule.runSteps(this.transformationSteps, contexts, startFrom, endTo);
    }
    static fromFile(collection, extFunctions) {
        const result = [];
        const symbolTypeRef = Object.values(StepTypeSymbol);
        const resultTypeRef = Object.values(ResultTypeSymbol);
        for (const stepKey in collection) {
            const resultTypeValue = stepKey[0];
            let ruleTypeValue = stepKey[1];
            if (resultTypeRef.includes(resultTypeValue) && symbolTypeRef.includes(ruleTypeValue)) {
                const key = stepKey.substr(2);
                const value = collection[stepKey];
                result.push(TransformationRule.getNew(ruleTypeValue, key, value, resultTypeValue, extFunctions));
            }
            else {
                ruleTypeValue = stepKey[0];
                if (symbolTypeRef.includes(ruleTypeValue)) {
                    const key = stepKey.substr(1);
                    const value = collection[stepKey];
                    result.push(TransformationRule.getNew(ruleTypeValue, key, value, ResultTypeSymbol.Transparent, extFunctions));
                }
                else {
                    throw new Error(`Step action [${ruleTypeValue}] from [${stepKey}] is not supported`);
                }
            }
        }
        return new TransformationRule(result);
    }
    static getNew(ruleTypeValue, key, value, resultTypeValue, extFunctions) {
        const resultTypeParser = new resultTypeCreator[resultTypeValue]();
        switch (stepTypeCreator[ruleTypeValue]) {
            case stepTypeCreator["+"]:
                return TransformationAddStep_1.TransformationAddStep.fromFile(key, value, resultTypeParser, extFunctions);
            case stepTypeCreator["-"]:
                return TransformationDelStep_1.TransformationDelStep.fromFile(key, value);
            case stepTypeCreator["@"]:
                return TransformationFuncStep_1.TransformationFuncStep.fromFile(key, value, resultTypeParser, extFunctions);
            default:
                throw new Error(`Step symbol is not valid. The valid ones are [${Object.keys(stepTypeCreator).join(",")}]`);
        }
    }
}
exports.TransformationRule = TransformationRule;
TransformationRule.runSteps = (steps, contexts, startFrom, endTo) => __awaiter(void 0, void 0, void 0, function* () {
    const { registry } = contexts;
    const maxLength = steps.length;
    startFrom = startFrom || 0;
    endTo = endTo || maxLength;
    for (let index = startFrom; index < endTo && index < maxLength; index++) {
        const step = steps[index];
        yield step.apply(contexts);
        const { goToError, goToAutoReply, goToRuleName, callToRuleName, forEach, for: forStep, forIn, while: whileStep, finishRule } = registry;
        if (goToError || goToAutoReply || goToRuleName || callToRuleName || forEach || forStep || forIn || whileStep || finishRule) {
            if (!registry.restOfStepsArray)
                registry.restOfStepsArray = [];
            registry.restOfStepsArray.push(steps.slice(index + 1, endTo));
            return;
        }
    }
});
