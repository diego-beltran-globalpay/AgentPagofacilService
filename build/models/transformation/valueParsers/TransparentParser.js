"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransparentParser = void 0;
const GenericParser_1 = require("./GenericParser");
class TransparentParser extends GenericParser_1.GenericParser {
    parse(value, logPrefix) {
        return value;
    }
}
exports.TransparentParser = TransparentParser;
