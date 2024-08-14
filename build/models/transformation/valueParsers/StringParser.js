"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringParser = void 0;
const GenericParser_1 = require("./GenericParser");
class StringParser extends GenericParser_1.GenericParser {
    parse(value, logPrefix) {
        this.logger.trace(`Parsing [${value}] from ${typeof value} to string`, { logPrefix });
        return value ? value.toString() : "";
    }
}
exports.StringParser = StringParser;
