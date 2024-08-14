"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDivisionITF = exports.DivisionITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.DivisionITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        DivResultType: {
            enum: ["Float", "Integer"],
            type: "string",
        },
    },
    properties: {
        fieldName2Source: {
            type: "string",
        },
        fieldNameSource: {
            type: "string",
        },
        resultType: {
            $ref: "#/definitions/DivResultType",
        },
    },
    required: ["fieldName2Source", "fieldNameSource", "resultType"],
    type: "object",
};
exports.isDivisionITF = exports.ajv.compile(exports.DivisionITFSchema);
function validate(value) {
    if (exports.isDivisionITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isDivisionITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "DivisionITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
