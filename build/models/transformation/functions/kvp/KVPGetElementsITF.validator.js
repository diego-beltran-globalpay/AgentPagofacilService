"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKVPGetElementsITF = exports.KVPGetElementsITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.KVPGetElementsITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        elementsSeparator: {
            type: "string",
        },
        fieldNameSource: {
            type: "string",
        },
        keyToFind: {
            type: "string",
        },
        kvSeparator: {
            type: "string",
        },
    },
    required: ["elementsSeparator", "fieldNameSource", "keyToFind", "kvSeparator"],
    type: "object",
};
exports.isKVPGetElementsITF = exports.ajv.compile(exports.KVPGetElementsITFSchema);
function validate(value) {
    if (exports.isKVPGetElementsITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isKVPGetElementsITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "KVPGetElementsITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;