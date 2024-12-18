"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSetDateTimeTzITF = exports.SetDateTimeTzITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.SetDateTimeTzITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        fieldNameDest: {
            type: "string",
        },
        timezone: {
            type: "string",
        },
    },
    type: "object",
};
exports.isSetDateTimeTzITF = exports.ajv.compile(exports.SetDateTimeTzITFSchema);
function validate(value) {
    if (exports.isSetDateTimeTzITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isSetDateTimeTzITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "SetDateTimeTzITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
