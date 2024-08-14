"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPaddingITF = exports.PaddingITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.PaddingITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        Position: {
            enum: ["D", "I", "L", "R"],
            type: "string",
        },
    },
    properties: {
        fieldNameSource: {
            type: "string",
        },
        leftOrRight: {
            $ref: "#/definitions/Position",
        },
        paddingChar: {
            type: "string",
        },
        paddingLength: {
            type: "number",
        },
    },
    required: ["fieldNameSource", "leftOrRight", "paddingChar", "paddingLength"],
    type: "object",
};
exports.isPaddingITF = exports.ajv.compile(exports.PaddingITFSchema);
function validate(value) {
    if (exports.isPaddingITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isPaddingITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "PaddingITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;