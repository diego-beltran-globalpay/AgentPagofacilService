"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegexOperator = exports.isEqualComparisonOperator = exports.isComparisonOperator = void 0;
function isComparisonOperator(arg) {
    return arg.LogicalOperator !== undefined;
}
exports.isComparisonOperator = isComparisonOperator;
function isEqualComparisonOperator(arg) {
    return arg.LogicalOperator === undefined && arg.Expression === undefined;
}
exports.isEqualComparisonOperator = isEqualComparisonOperator;
function isRegexOperator(arg) {
    return arg.Expression !== undefined;
}
exports.isRegexOperator = isRegexOperator;
