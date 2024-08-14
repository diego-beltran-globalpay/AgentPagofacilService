"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGenerateField043ITF = exports.GenerateField043ITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.GenerateField043ITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        agregator: {
            type: "string",
        },
        codposDefault: {
            type: "string",
        },
        codposName: {
            type: "string",
        },
        countryCode: {
            type: "string",
        },
        direccionDefault: {
            type: "string",
        },
        direccionName: {
            type: "string",
        },
        email: {
            type: "string",
        },
        fieldNameDest: {
            type: "string",
        },
        razonsocialDefault: {
            type: "string",
        },
        razonsocialName: {
            type: "string",
        },
        regionCode: {
            type: "string",
        },
        telefono: {
            type: "string",
        },
    },
    required: [
        "agregator",
        "codposDefault",
        "codposName",
        "countryCode",
        "direccionDefault",
        "direccionName",
        "email",
        "razonsocialDefault",
        "razonsocialName",
        "regionCode",
        "telefono",
    ],
    type: "object",
};
exports.isGenerateField043ITF = exports.ajv.compile(exports.GenerateField043ITFSchema);
function validate(value) {
    if (exports.isGenerateField043ITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isGenerateField043ITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "GenerateField043ITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;