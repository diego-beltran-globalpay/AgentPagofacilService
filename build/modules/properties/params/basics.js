"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicsProps = void 0;
exports.BasicsProps = [
    {
        propName: "useConfigIni",
        type: "boolean",
        defaultValue: false,
        description: "Indicates if a config ini will be use",
    },
    {
        propName: "configIniPath",
        type: "string",
        defaultValue: "./etc/config.ini",
        description: "Path to .ini config file.",
    },
    {
        propName: "runOnTestMode",
        type: "boolean",
        defaultValue: false,
        description: "Flag to indicate if we will close the app after 15 seconds",
    },
    {
        propName: "customPropsDefinitionFilePath",
        type: "string",
        defaultValue: "./etc/customProperties.json",
        description: "Path to .json config file that allow to introduce not standard options.",
    },
];
