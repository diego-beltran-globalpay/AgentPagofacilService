"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksSchedulerProps = void 0;
exports.TasksSchedulerProps = [
    {
        propName: "tasksFilePath",
        defaultValue: "./config/transformation/AuthTransformation.json",
        description: "Files that indicate how to execute the tasks you want. Each path must be separated by a comma (,)",
    },
    {
        propName: "tasksReloadFileMode",
        defaultValue: "once",
        description: "Indicate if the files will be loaded once, per each execution or within an interval",
    },
    {
        propName: "tasksReloadFileInterval",
        type: "integer",
        defaultValue: 60000,
        description: "Indicate the time interval to reload files",
    },
    {
        propName: "tasksNames",
        type: "string",
        defaultValue: undefined,
        description: "List of task names (rule name) for each task, separated by -",
    },
    {
        propName: "tasksCrones",
        type: "string",
        defaultValue: undefined,
        description: "List of cron config style for each task, separated by -",
    },
    {
        propName: "enableScheduler",
        type: "boolean",
        defaultValue: false,
        description: "Enable scheduler process",
    },
    {
        propName: "tasksExtFunctionsFolderPath",
        type: "string",
        defaultValue: undefined,
        description: "Dir path where we look for extension step functions to this module",
    },
];
