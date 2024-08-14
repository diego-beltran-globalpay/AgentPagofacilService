"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlMsgsProps = void 0;
exports.ControlMsgsProps = [
    {
        propName: "controlMsgsRulesFilePath",
        defaultValue: "./config/transformation/Transformation.json",
        description: "Files that indicate how to create control messages. Each path must be separated by a comma (,)",
    },
    {
        propName: "controlMsgReloadFileMode",
        defaultValue: "once",
        description: "Indicate if the rules for control messages will be loaded once, per each transaction or within an interval",
    },
    {
        propName: "controlMsgReloadFileInterval",
        type: "integer",
        defaultValue: 60000,
        description: "Indicate the time interval to reload files",
    },
];
