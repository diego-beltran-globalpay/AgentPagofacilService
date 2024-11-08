"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWhileITF = exports.WhileITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.WhileITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        fieldNameDest: {
            type: "string",
        },
        fieldNameSource: {
            type: "string",
        },
        ruleName: {
            type: "string",
        },
    },
    required: ["fieldNameSource", "ruleName"],
    type: "object",
};
exports.isWhileITF = exports.ajv.compile(exports.WhileITFSchema);
function validate(value) {
    if (exports.isWhileITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isWhileITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "WhileITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
