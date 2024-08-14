"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIndexOfITF = exports.IndexOfITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.IndexOfITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        fieldNameSource: {
            type: "string",
        },
        startPosSource: {
            type: "string",
        },
        stringToLookSource: {
            type: "string",
        },
    },
    required: ["fieldNameSource", "stringToLookSource"],
    type: "object",
};
exports.isIndexOfITF = exports.ajv.compile(exports.IndexOfITFSchema);
function validate(value) {
    if (exports.isIndexOfITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isIndexOfITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "IndexOfITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;