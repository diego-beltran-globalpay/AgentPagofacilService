"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSendRawDataToEndpointITF = exports.SendRawDataToEndpointITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.SendRawDataToEndpointITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        BufferEncoding: {
            enum: ["ascii", "base64", "binary", "hex", "latin1", "ucs-2", "ucs2", "utf-8", "utf16le", "utf8"],
            type: "string",
        },
    },
    properties: {
        endpointName: {
            type: "string",
        },
        fieldNameDest: {
            type: "string",
        },
        fieldNameSource: {
            type: "string",
        },
        type: {
            $ref: "#/definitions/BufferEncoding",
        },
    },
    required: ["endpointName", "fieldNameDest", "fieldNameSource", "type"],
    type: "object",
};
exports.isSendRawDataToEndpointITF = exports.ajv.compile(exports.SendRawDataToEndpointITFSchema);
function validate(value) {
    if (exports.isSendRawDataToEndpointITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isSendRawDataToEndpointITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "SendRawDataToEndpointITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
