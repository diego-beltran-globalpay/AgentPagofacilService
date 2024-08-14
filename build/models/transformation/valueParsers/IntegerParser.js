"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerParser = void 0;
const GenericParser_1 = require("./GenericParser");
class IntegerParser extends GenericParser_1.GenericParser {
    parse(value, logPrefix) {
        if (isNaN(value))
            throw new Error(`This value [${value}] is not an integer one`);
        this.logger.trace(`Parsing [${value}] from ${typeof value} to integer`, { logPrefix });
        return parseInt(value);
    }
}
exports.IntegerParser = IntegerParser;
