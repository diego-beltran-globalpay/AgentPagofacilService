"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSplitITF = exports.SplitITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.SplitITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        fieldNameSource: {
            type: "string",
        },
        indextToReturn: {
            type: "string",
        },
        splitValue: {
            type: "string",
        },
    },
    required: ["fieldNameSource", "splitValue"],
    type: "object",
};
exports.isSplitITF = exports.ajv.compile(exports.SplitITFSchema);
function validate(value) {
    if (exports.isSplitITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isSplitITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "SplitITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
