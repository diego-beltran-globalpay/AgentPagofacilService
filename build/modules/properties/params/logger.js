"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerProps = void 0;
exports.LoggerProps = [
    {
        propName: "logFilePath",
        country: "ARG",
        shortcut: "",
        defaultValue: "./logs/Server.log",
        description: "Log File Name. If logConfig option is set, this option is not used.",
    },
    {
        propName: "logLevel",
        country: "ARG",
        shortcut: "",
        defaultValue: "TRACE",
        description: "Log Level: TRACE, DEBUG, ... If logConfig option is set, this option is not used.",
    },
    {
        propName: "logConfig",
        defaultValue: "../config/logger/adapter_log4js.configure",
        description: "Log4js Configuration file, and time (ms) to refresh it.",
    },
    {
        propName: "logFileMaxBackups",
        defaultValue: 5,
        type: "integer",
        description: "Log Max Backups. If logConfig option is set, this option is not used.",
    },
    {
        propName: "logFileMaxSize",
        defaultValue: 300000000,
        type: "integer",
        description: "Log File Size Configuration. If logConfig option is set, this option is not used.",
    },
    {
        propName: "logModule",
        defaultValue: "log4js",
        description: "Log module to use. Types: [].",
    },
    {
        propName: "logCategory",
        defaultValue: "Server",
        description: "Log4js Configuration file, and time (ms) to refresh it.",
    },
    {
        propName: "logHostname",
        defaultValue: "localhost",
        description: "Log server IP to use with syslog.",
    },
    {
        propName: "logNodeName",
        defaultValue: "Core",
        description: "Log server name to use with graylog.",
    },
    {
        propName: "logPort",
        defaultValue: 514,
        type: "integer",
        description: "Log server port to use with syslog.",
    },
    {
        propName: "logBufferSize",
        defaultValue: 1350,
        type: "integer",
        description: "UDP packet size for graylog.",
    },
    {
        propName: "logAdditionalTokens",
        defaultValue: "",
        description: "Additional tokens to add in the log line.",
    },
];
