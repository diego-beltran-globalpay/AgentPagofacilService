"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatorProps = void 0;
exports.AuthenticatorProps = [
    {
        propName: "authenticatorRulesFilePath",
        defaultValue: "./config/transformation/AuthTransformation.json",
        description: "Files that indicate how to create authentication messages. Each path must be separated by a comma (,)",
    },
    {
        propName: "authenticatorReloadFileMode",
        defaultValue: "once",
        description: "Indicate if the rules for authentication messages will be loaded once, per each transaction or within an interval",
    },
    {
        propName: "authenticatorReloadFileInterval",
        type: "integer",
        defaultValue: 60000,
        description: "Indicate the time interval to reload files",
    },
    {
        propName: "authenticatorExtFunctionsFolderPath",
        type: "string",
        defaultValue: undefined,
        description: "Dir path where we look for extension step functions to this module",
    },
];
