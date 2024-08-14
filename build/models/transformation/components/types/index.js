"use strict";
// -------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInnerTransformationUnitJSON_2 = exports.isInnerTransformationUnitJSON_1 = void 0;
const isInnerTransformationUnitJSON_1 = (value) => {
    return value instanceof Object && value.Rule && value.Match;
};
exports.isInnerTransformationUnitJSON_1 = isInnerTransformationUnitJSON_1;
const isInnerTransformationUnitJSON_2 = (value) => {
    return value instanceof Object && value.Rule && value.Match;
};
exports.isInnerTransformationUnitJSON_2 = isInnerTransformationUnitJSON_2;
