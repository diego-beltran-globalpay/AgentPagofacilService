"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatParser = void 0;
const GenericParser_1 = require("./GenericParser");
class FloatParser extends GenericParser_1.GenericParser {
    parse(value, logPrefix) {
        if (isNaN(value))
            throw new Error(`This value [${value}] is not a float one`);
        this.logger.trace(`Parsing [${value}] from ${typeof value} to float`, { logPrefix });
        return parseFloat(value);
    }
}
exports.FloatParser = FloatParser;
