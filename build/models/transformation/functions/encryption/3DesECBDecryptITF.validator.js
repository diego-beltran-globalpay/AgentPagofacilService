"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isThreeDesECBDecryptITF = exports.ThreeDesECBDecryptITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.ThreeDesECBDecryptITFSchema = {
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
exports.isThreeDesECBDecryptITF = exports.ajv.compile(exports.ThreeDesECBDecryptITFSchema);
function validate(value) {
    if (exports.isThreeDesECBDecryptITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isThreeDesECBDecryptITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "ThreeDesECBDecryptITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
