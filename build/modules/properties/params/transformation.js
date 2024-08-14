"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformationProps = void 0;
exports.TransformationProps = [
    {
        propName: "transformFilePath",
        defaultValue: "./config/transformation/Transformation.json",
        description: "File that indicate how to transform the  messages",
    },
    {
        propName: "transformationReloadFileMode",
        defaultValue: "once",
        description: "Indicate if the transformFile will be loaded once, per each transaction or within an interval",
    },
    {
        propName: "transformationReloadFileInterval",
        type: "integer",
        defaultValue: 60000,
        description: "Indicate the time interval to reload transformFiles",
    },
    {
        propName: "applyDefaultRule",
        defaultValue: false,
        description: "Indicate if apply default rule if no rule is matched.",
    },
    {
        propName: "transformationKSPrivFilePath",
        type: "string",
        defaultValue: "",
        description: "Private key file path required files if they are encrpyted",
    },
    {
        propName: "transformationKSPubFilePath",
        type: "string",
        defaultValue: "",
        description: "Public key file path required files if they are encrpyted",
    },
    {
        propName: "transformationKeyPassphrase",
        type: "string",
        defaultValue: undefined,
        description: "Passphrase to open private key, if it requires one",
    },
    {
        propName: "transformationKeysPadding",
        type: "integer",
        defaultValue: 1,
        description: "Private and public pair keys padding format",
    },
    {
        propName: "transformationKeysFormat",
        type: "string",
        defaultValue: "pkcs1",
        description: "Private and public pair keys format",
    },
    {
        propName: "transformationUseEncryption",
        type: "boolean",
        defaultValue: false,
        description: "Enable use of encription on required files",
    },
    {
        propName: "transformationExtFunctionsFolderPath",
        type: "string",
        defaultValue: undefined,
        description: "Dir path where we look for extension step functions to this module",
    },
];
