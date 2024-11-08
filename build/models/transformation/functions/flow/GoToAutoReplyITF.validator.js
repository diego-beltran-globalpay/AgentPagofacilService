"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGoToAutoReplyITF = exports.GoToAutoReplyITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.GoToAutoReplyITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        cleanFinalMessage: {
            type: "boolean",
        },
        fieldNameDest: {
            type: "string",
        },
    },
    required: ["cleanFinalMessage"],
    type: "object",
};
exports.isGoToAutoReplyITF = exports.ajv.compile(exports.GoToAutoReplyITFSchema);
function validate(value) {
    if (exports.isGoToAutoReplyITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isGoToAutoReplyITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "GoToAutoReplyITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
