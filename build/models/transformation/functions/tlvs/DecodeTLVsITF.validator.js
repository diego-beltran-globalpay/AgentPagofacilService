"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDecodeTLVsITF = exports.DecodeTLVsITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.DecodeTLVsITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        TransfContextsRef: {
            enum: ["%R", "%S", "%T"],
            type: "string",
        },
    },
    properties: {
        fieldNameSource: {
            type: "string",
        },
        prefix: {
            type: "string",
        },
        resultDestRef: {
            $ref: "#/definitions/TransfContextsRef",
        },
    },
    required: ["fieldNameSource", "prefix", "resultDestRef"],
    type: "object",
};
exports.isDecodeTLVsITF = exports.ajv.compile(exports.DecodeTLVsITFSchema);
function validate(value) {
    if (exports.isDecodeTLVsITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isDecodeTLVsITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "DecodeTLVsITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
