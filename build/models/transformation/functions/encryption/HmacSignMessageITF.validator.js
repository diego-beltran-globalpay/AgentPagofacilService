"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHmacSignMessageITF = exports.HmacSignMessageITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.HmacSignMessageITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        BinaryToTextEncoding: {
            enum: ["base64", "hex"],
            type: "string",
        },
    },
    properties: {
        clientKeySource: {
            type: "string",
        },
        clientSecretSource: {
            type: "string",
        },
        encoding: {
            $ref: "#/definitions/BinaryToTextEncoding",
        },
        fieldNameSource: {
            type: "string",
        },
    },
    required: ["clientKeySource", "clientSecretSource", "encoding", "fieldNameSource"],
    type: "object",
};
exports.isHmacSignMessageITF = exports.ajv.compile(exports.HmacSignMessageITFSchema);
function validate(value) {
    if (exports.isHmacSignMessageITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isHmacSignMessageITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "HmacSignMessageITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;