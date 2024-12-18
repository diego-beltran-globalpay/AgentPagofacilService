"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isThreeDesECBEncryptITF = exports.ThreeDesECBEncryptITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.ThreeDesECBEncryptITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        fieldNameSource: {
            type: "string",
        },
        keyFieldName: {
            type: "string",
        },
    },
    required: ["fieldNameSource", "keyFieldName"],
    type: "object",
};
exports.isThreeDesECBEncryptITF = exports.ajv.compile(exports.ThreeDesECBEncryptITFSchema);
function validate(value) {
    if (exports.isThreeDesECBEncryptITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isThreeDesECBEncryptITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "ThreeDesECBEncryptITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
