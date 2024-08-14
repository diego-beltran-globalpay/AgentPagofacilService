"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppKeyStorePropsITF = exports.AppKeyStorePropsITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.AppKeyStorePropsITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    properties: {
        secureStoreKeyPassphrase: {
            type: "string",
        },
        secureStoreKeysFormat: {
            enum: [
                "components",
                "components-der",
                "components-pem",
                "components-private",
                "components-private-der",
                "components-private-pem",
                "components-public",
                "components-public-der",
                "components-public-pem",
                "openssh-private",
                "openssh-public",
                "pkcs1",
                "pkcs1-der",
                "pkcs1-pem",
                "pkcs1-private",
                "pkcs1-private-der",
                "pkcs1-private-pem",
                "pkcs1-public",
                "pkcs1-public-der",
                "pkcs1-public-pem",
                "pkcs8",
                "pkcs8-der",
                "pkcs8-pem",
                "pkcs8-private",
                "pkcs8-private-der",
                "pkcs8-private-pem",
                "pkcs8-public",
                "pkcs8-public-der",
                "pkcs8-public-pem",
                "private",
                "public",
            ],
            type: "string",
        },
        secureStoreKeysPadding: {
            type: "number",
        },
        secureStorePrivFilePath: {
            type: "string",
        },
        secureStorePubFilePath: {
            type: "string",
        },
    },
    required: ["secureStorePrivFilePath", "secureStorePubFilePath"],
    type: "object",
};
exports.isAppKeyStorePropsITF = exports.ajv.compile(exports.AppKeyStorePropsITFSchema);
function validate(value) {
    if (exports.isAppKeyStorePropsITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isAppKeyStorePropsITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "AppKeyStorePropsITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;