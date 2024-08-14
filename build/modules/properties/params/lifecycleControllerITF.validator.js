"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLifecycleControllerPropsITF = exports.LifecycleControllerPropsITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.LifecycleControllerPropsITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        enableLifecycleController: {
            type: "boolean",
        },
        lifecycleFunctionsFolderPath: {
            type: "string",
        },
        lifecycleFunctionsPrefixes: {
            type: "string",
        },
    },
    required: ["enableLifecycleController", "lifecycleFunctionsFolderPath", "lifecycleFunctionsPrefixes"],
    type: "object",
};
exports.isLifecycleControllerPropsITF = exports.ajv.compile(exports.LifecycleControllerPropsITFSchema);
function validate(value) {
    if (exports.isLifecycleControllerPropsITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isLifecycleControllerPropsITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "LifecycleControllerPropsITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;