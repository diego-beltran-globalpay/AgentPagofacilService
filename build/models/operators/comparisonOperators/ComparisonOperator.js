"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonOperator = void 0;
const index_1 = require("./index");
const comparisonOpCreator = {
    ["<"]: index_1.LessThan,
    ["<="]: index_1.LessEqualThan,
    [">"]: index_1.GreaterThan,
    [">="]: index_1.GreaterEqualThan,
    ["="]: index_1.Equal,
    ["!="]: index_1.NotEqual,
};
class ComparisonOperator {
    constructor(operator, toCompare) {
        this.operator = operator;
        this.toCompare = toCompare;
    }
    static fromString(stringOp, toCompare) {
        if (!Object.keys(comparisonOpCreator).includes(stringOp))
            throw new Error(`This comparison operator ${stringOp} is not supported`);
        return new ComparisonOperator(new comparisonOpCreator[stringOp](), toCompare);
    }
    compare(sourceValue, toCompare, options = {}) {
        if (this.toCompare)
            return this.operator.compare(sourceValue, this.toCompare, options);
        else
            return this.operator.compare(sourceValue, toCompare, options);
    }
}
exports.ComparisonOperator = ComparisonOperator;
