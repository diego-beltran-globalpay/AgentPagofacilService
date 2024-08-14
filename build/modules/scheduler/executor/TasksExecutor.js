"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksExecutor = void 0;
const TasksExecutorFileType_1 = require("./files/TasksExecutorFileType");
const TasksExecutorFileType_validator_1 = __importDefault(require("./files/TasksExecutorFileType.validator"));
const transformation_1 = require("../../../models/transformation");
class TasksExecutor extends transformation_1.Transformation {
    constructor(opts) {
        super(opts);
    }
    validateFile(fileJSON) {
        return TasksExecutorFileType_validator_1.default(fileJSON);
    }
    existsTask(rule) {
        return this.existsGroupRule(rule);
    }
    execTask(message, rule) {
        return this.transformMessage(message, TasksExecutorFileType_1.TasksExecutorDirAvbEnum.Task, rule);
    }
}
exports.TasksExecutor = TasksExecutor;
