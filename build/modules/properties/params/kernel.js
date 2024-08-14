"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KernelProps = void 0;
exports.KernelProps = [
    {
        propName: "enableClientTcpListener",
        type: "boolean",
        defaultValue: true,
        description: "Enable client tcp server to listen to new connections",
    },
    {
        propName: "enableTargetTcpListener",
        type: "boolean",
        defaultValue: false,
        description: "Enable target tcp server to listen to new connections",
    },
    {
        propName: "enableClientHttpListener",
        type: "boolean",
        defaultValue: true,
        description: "Enable client http server to listen to new connections",
    },
    {
        propName: "enableTargetHttpListener",
        type: "boolean",
        defaultValue: false,
        description: "Enable target http server to listen to new connections",
    },
    {
        propName: "enableClientWsListener",
        type: "boolean",
        defaultValue: true,
        description: "Enable client ws server to listen to new connections",
    },
    {
        propName: "enableTargetWsListener",
        type: "boolean",
        defaultValue: false,
        description: "Enable target ws server to listen to new connections",
    },
    {
        propName: "enableTargetHttpCaller",
        type: "boolean",
        defaultValue: false,
        description: "Enable target http caller to send messages to an endpoint",
    },
    {
        propName: "enableTargetTcpCaller",
        type: "boolean",
        defaultValue: false,
        description: "Enable target tcp caller to send messages to an endpoint",
    },
    {
        propName: "enableTargetSerialCaller",
        type: "boolean",
        defaultValue: false,
        description: "Enable target serial caller to send messages to an endpoint",
    },
    {
        propName: "enableClientHttpCaller",
        type: "boolean",
        defaultValue: false,
        description: "Enable client http caller to send messages to an endpoint",
    },
    {
        propName: "enableClientTcpCaller",
        type: "boolean",
        defaultValue: false,
        description: "Enable client tcp caller to send messages to an endpoint",
    },
    {
        propName: "enableClientSerialCaller",
        type: "boolean",
        defaultValue: false,
        description: "Enable client serial caller to send messages to an endpoint",
    },
    {
        propName: "applyLevelTransformation",
        type: "boolean",
        defaultValue: false,
        description: "Flag that indicate if the level process will be exectued",
    },
    {
        propName: "applyElementMapping",
        type: "boolean",
        defaultValue: false,
        description: "Flag that indicate if the element mapping process will be exectued",
    },
    {
        propName: "clientSwitchFilePath",
        defaultValue: "./config/switch/switch.conf",
        description: "File path where we will find the client to target switch file",
    },
    {
        propName: "clientSwitchReloadInterval",
        defaultValue: 60,
        description: "Interval to reload the client to target switch file",
    },
    {
        propName: "targetSwitchFilePath",
        defaultValue: "./config/switch/switch.conf",
        description: "File path where we will find the target to client switch file",
    },
    {
        propName: "targetSwitchReloadInterval",
        defaultValue: 60,
        description: "Interval to reload the target to client switch file",
    },
    {
        propName: "clientContextFieldsList",
        defaultValue: "011,041",
        description: "List of name of the fields used to generate the context, separated by ,",
    },
    {
        propName: "clientAltContextFieldsList",
        defaultValue: "011,041",
        description: "List of name of the secondary fields used to generate the context, separated by ,",
    },
    {
        propName: "clientContextKeyType",
        defaultValue: "cleaned",
        description: "Type of process we have to apply to get the context key",
    },
    {
        propName: "clientAltContextKeyType",
        defaultValue: "transparent",
        description: "Type of process we have to apply to get the alternative context key",
    },
    {
        propName: "targetContextFieldsList",
        defaultValue: "011,041",
        description: "List of name of the fields used to generate the context, separated by ,",
    },
    {
        propName: "targetAltContextFieldsList",
        defaultValue: "011,041",
        description: "List of name of the secondary fields used to generate the context, separated by ,",
    },
    {
        propName: "targetContextKeyType",
        defaultValue: "cleaned",
        description: "Type of process we have to apply to get the context key",
    },
    {
        propName: "targetAltContextKeyType",
        defaultValue: "transparent",
        description: "Type of process we have to apply to get the alternative context key",
    },
    {
        propName: "targetPoolMethod",
        defaultValue: "balance",
        description: "",
    },
    {
        propName: "clientPoolMethod",
        defaultValue: "balance",
        description: "",
    },
    {
        propName: "useSecureStore",
        type: "boolean",
        defaultValue: false,
        description: "Enable use of encription on app properties which have sensitive data like passwords",
    },
    {
        propName: "loadDbModule",
        type: "boolean",
        defaultValue: false,
        description: "Enable the import of DB module. It is required to use db contexts.",
    },
    {
        propName: "loadSerialPortModule",
        type: "boolean",
        defaultValue: false,
        description: "Enable the import of serialport module. It is required to use serialport connections, both clients and targets",
    },
    {
        propName: "loadWasiModule",
        type: "boolean",
        defaultValue: false,
        description: "Enable the import of wasi module. It is required to execute WebAssembly code",
    },
    {
        propName: "loadAxiosModule",
        type: "boolean",
        defaultValue: false,
        description: "Enable the import of axios module. It is required to execute SendByHttp function on transformation module",
    },
    {
        propName: "loadIso8583Module",
        type: "boolean",
        defaultValue: false,
        description: "Enable the import of iso8583 module. It is required to use iso8583 encoding, both clients and targets",
    },
];
