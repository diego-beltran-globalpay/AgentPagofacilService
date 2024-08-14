"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDecodeTokensITF = exports.DecodeTokensITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.DecodeTokensITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        TokenTypes: {
            enum: ["0", "1", "2", "3"],
            type: "string",
        },
        TransfContextsRef: {
            enum: ["%R", "%S", "%T"],
            type: "string",
        },
    },
    properties: {
        convertFrom: {
            enum: ["ascii", "base64", "binary", "hex", "latin1", "ucs2", "utf16le", "utf8"],
            type: "string",
        },
        convertTo: {
            enum: ["ascii", "base64", "binary", "hex", "latin1", "ucs2", "utf16le", "utf8"],
            type: "string",
        },
        fieldNameSource: {
            type: "string",
        },
        prefix: {
            type: "string",
        },
        resultDest: {
            $ref: "#/definitions/TransfContextsRef",
        },
        tokenType: {
            $ref: "#/definitions/TokenTypes",
        },
    },
    required: ["fieldNameSource", "prefix", "resultDest", "tokenType"],
    type: "object",
};
exports.isDecodeTokensITF = exports.ajv.compile(exports.DecodeTokensITFSchema);
function validate(value) {
    if (exports.isDecodeTokensITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isDecodeTokensITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "DecodeTokensITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
