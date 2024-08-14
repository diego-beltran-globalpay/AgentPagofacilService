"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanParser = void 0;
const GenericParser_1 = require("./GenericParser");
class BooleanParser extends GenericParser_1.GenericParser {
    parse(value, logPrefix) {
        this.logger.trace(`Parsing [${value}] from ${typeof value} to boolean`, { logPrefix });
        return !!value;
    }
}
exports.BooleanParser = BooleanParser;
