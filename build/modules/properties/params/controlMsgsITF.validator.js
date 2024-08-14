"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isControlMsgsPropsITF = exports.ControlMsgsPropsITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.ControlMsgsPropsITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        ReloadFileMode: {
            enum: ["each", "interval", "once"],
            type: "string",
        },
    },
    properties: {
        controlMsgReloadFileInterval: {
            type: "number",
        },
        controlMsgReloadFileMode: {
            $ref: "#/definitions/ReloadFileMode",
        },
        controlMsgsRulesFilePath: {
            type: "string",
        },
    },
    required: ["controlMsgReloadFileMode", "controlMsgsRulesFilePath"],
    type: "object",
};
exports.isControlMsgsPropsITF = exports.ajv.compile(exports.ControlMsgsPropsITFSchema);
function validate(value) {
    if (exports.isControlMsgsPropsITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isControlMsgsPropsITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "ControlMsgsPropsITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;