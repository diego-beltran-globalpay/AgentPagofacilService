"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubstrITF = exports.SubstrITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.SubstrITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        applyTrim: {
            type: "boolean",
        },
        fieldNameSource: {
            type: "string",
        },
        initPosition: {
            type: "string",
        },
        lengthFieldName: {
            type: "string",
        },
    },
    required: ["applyTrim", "fieldNameSource", "initPosition", "lengthFieldName"],
    type: "object",
};
exports.isSubstrITF = exports.ajv.compile(exports.SubstrITFSchema);
function validate(value) {
    if (exports.isSubstrITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isSubstrITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "SubstrITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
