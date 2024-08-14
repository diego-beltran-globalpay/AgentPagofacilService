"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isParseAmexGCAGRespCCITF = exports.ParseAmexGCAGRespCCITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.ParseAmexGCAGRespCCITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        fieldNameSource: {
            type: "string",
        },
    },
    required: ["fieldNameSource"],
    type: "object",
};
exports.isParseAmexGCAGRespCCITF = exports.ajv.compile(exports.ParseAmexGCAGRespCCITFSchema);
function validate(value) {
    if (exports.isParseAmexGCAGRespCCITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isParseAmexGCAGRespCCITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "ParseAmexGCAGRespCCITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
