"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConvertFormatITF = exports.ConvertFormatITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.ConvertFormatITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        BufferEncoding: {
            enum: ["ascii", "base64", "binary", "hex", "latin1", "ucs-2", "ucs2", "utf-8", "utf16le", "utf8"],
            type: "string",
        },
    },
    properties: {
        dstFormat: {
            $ref: "#/definitions/BufferEncoding",
        },
        fieldNameSource: {
            type: "string",
        },
        srcFormat: {
            $ref: "#/definitions/BufferEncoding",
        },
    },
    required: ["dstFormat", "fieldNameSource", "srcFormat"],
    type: "object",
};
exports.isConvertFormatITF = exports.ajv.compile(exports.ConvertFormatITFSchema);
function validate(value) {
    if (exports.isConvertFormatITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isConvertFormatITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "ConvertFormatITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
