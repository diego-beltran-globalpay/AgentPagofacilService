"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformationRuleCollection = void 0;
const TransformationRule_1 = require("./TransformationRule");
class TransformationRuleCollection {
    constructor(rules) {
        this.rules = rules;
    }
    static fromFile(collection, extFunctions) {
        const result = [];
        for (const element of collection) {
            result.push(TransformationRule_1.TransformationRule.fromFile(element, extFunctions));
        }
        return new TransformationRuleCollection(result);
    }
    apply(ruleNum, contexts) {
        if (!this.rules[ruleNum])
            throw new Error(`The rule with number ${ruleNum} is was not found.`);
        return this.rules[ruleNum].apply(contexts);
    }
}
exports.TransformationRuleCollection = TransformationRuleCollection;
TransformationRuleCollection.isInstanceOf = (value) => {
    return value instanceof Object && value.rules instanceof Array;
};
