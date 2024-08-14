"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTasksSchedulerPropsITF = exports.TasksSchedulerPropsITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.TasksSchedulerPropsITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        ReloadFileMode: {
            enum: ["each", "interval", "once"],
            type: "string",
        },
    },
    properties: {
        enableScheduler: {
            type: "boolean",
        },
        tasksCrones: {
            type: "string",
        },
        tasksExtFunctionsFolderPath: {
            type: "string",
        },
        tasksFilePath: {
            type: "string",
        },
        tasksNames: {
            type: "string",
        },
        tasksReloadFileInterval: {
            type: "number",
        },
        tasksReloadFileMode: {
            $ref: "#/definitions/ReloadFileMode",
        },
    },
    required: ["enableScheduler", "tasksFilePath", "tasksReloadFileMode"],
    type: "object",
};
exports.isTasksSchedulerPropsITF = exports.ajv.compile(exports.TasksSchedulerPropsITFSchema);
function validate(value) {
    if (exports.isTasksSchedulerPropsITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isTasksSchedulerPropsITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "TasksSchedulerPropsITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
