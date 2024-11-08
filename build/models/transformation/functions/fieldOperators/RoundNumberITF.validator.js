"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoundNumberITF = exports.RoundNumberITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.RoundNumberITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        decimalLength: {
            type: "number",
        },
        fieldNameSource: {
            type: "string",
        },
    },
    required: ["decimalLength", "fieldNameSource"],
    type: "object",
};
exports.isRoundNumberITF = exports.ajv.compile(exports.RoundNumberITFSchema);
function validate(value) {
    if (exports.isRoundNumberITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isRoundNumberITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "RoundNumberITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
