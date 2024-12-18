"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGetEBCDICFromFieldITF = exports.GetEBCDICFromFieldITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.GetEBCDICFromFieldITFSchema = {
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
exports.isGetEBCDICFromFieldITF = exports.ajv.compile(exports.GetEBCDICFromFieldITFSchema);
function validate(value) {
    if (exports.isGetEBCDICFromFieldITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isGetEBCDICFromFieldITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "GetEBCDICFromFieldITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
