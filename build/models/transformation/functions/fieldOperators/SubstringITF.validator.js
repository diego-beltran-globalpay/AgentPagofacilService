"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubstringITF = exports.SubstringITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.SubstringITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        applyTrim: {
            type: "boolean",
        },
        fieldNameSource: {
            type: "string",
        },
        finalPositionSource: {
            type: "string",
        },
        initPositionSource: {
            type: "string",
        },
    },
    required: ["applyTrim", "fieldNameSource", "finalPositionSource", "initPositionSource"],
    type: "object",
};
exports.isSubstringITF = exports.ajv.compile(exports.SubstringITFSchema);
function validate(value) {
    if (exports.isSubstringITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isSubstringITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "SubstringITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
