"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isElementMappingPropsITF = exports.ElementMappingPropsITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.ElementMappingPropsITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        clientElementMappingAfTransf: {
            type: "string",
        },
        clientElementMappingBfTransf: {
            type: "string",
        },
        elementMappingFilePath: {
            type: "string",
        },
        loadElementMappingOnce: {
            type: "boolean",
        },
        targetElementMappingAfTransf: {
            type: "string",
        },
        targetElementMappingBfTransf: {
            type: "string",
        },
    },
    required: [
        "clientElementMappingAfTransf",
        "clientElementMappingBfTransf",
        "elementMappingFilePath",
        "loadElementMappingOnce",
        "targetElementMappingAfTransf",
        "targetElementMappingBfTransf",
    ],
    type: "object",
};
exports.isElementMappingPropsITF = exports.ajv.compile(exports.ElementMappingPropsITFSchema);
function validate(value) {
    if (exports.isElementMappingPropsITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isElementMappingPropsITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "ElementMappingPropsITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;