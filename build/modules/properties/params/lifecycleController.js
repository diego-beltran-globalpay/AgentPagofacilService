"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleControllerProps = void 0;
exports.LifecycleControllerProps = [
    {
        propName: "enableLifecycleController",
        type: "boolean",
        defaultValue: false,
        description: "Enable app lifecycle controller. The phases are start, end and error",
    },
    {
        propName: "lifecycleFunctionsFolderPath",
        type: "string",
        defaultValue: "./config/lifecycle",
        description: "Dir path where we look for functions designed to be execute on app lifecycle phases",
    },
    {
        propName: "lifecycleFunctionsPrefixes",
        defaultValue: "Start:Init_,End:End_,Error:Fatal_",
        description: "Prefixes to identify each function with its lifecycle phases. The phases are Start, End and Error. An example could be 'Start:Init_,End:End_,Error:Fatal_'",
    },
];
