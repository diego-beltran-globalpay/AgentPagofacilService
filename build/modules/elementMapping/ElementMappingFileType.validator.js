"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isElementMappingFile = exports.ElementMappingFileSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.ElementMappingFileSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        ElementsMapping: {
            additionalProperties: {
                additionalProperties: {
                    type: "string",
                },
                defaultProperties: [],
                type: "object",
            },
            defaultProperties: [],
            type: "object",
        },
    },
    required: ["ElementsMapping"],
    type: "object",
};
exports.isElementMappingFile = exports.ajv.compile(exports.ElementMappingFileSchema);
function validate(value) {
    if (exports.isElementMappingFile(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isElementMappingFile.errors.filter((e) => e.keyword !== "if"), { dataVar: "ElementMappingFile" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;