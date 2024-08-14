"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueParser = void 0;
class ValueParser {
    static parseValue(type, val) {
        if (val === undefined)
            return val;
        switch (type) {
            case "string|integer":
                return !isNaN(parseInt(val)) ? parseInt(val) : val;
            case "integer":
            case "integer[]":
                return parseInt(val);
            case "boolean":
            case "boolean[]":
                return typeof val === "boolean" ? val : val === "true" || parseInt(val) === 1;
            case "float":
            case "float[]":
                return parseFloat(val);
            case "string":
            case "string[]":
                return val.toString();
            default:
                return val;
        }
    }
}
exports.ValueParser = ValueParser;
