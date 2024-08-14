"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const uuid = __importStar(require("uuid"));
const nodeCron = __importStar(require("node-cron"));
const models_1 = require("../../models");
const LoggersColletion_1 = require("../logger/LoggersColletion");
const AppPropsInstance_1 = require("../properties/AppPropsInstance");
const TasksExecutor_1 = require("./executor/TasksExecutor");
class Scheduler {
    constructor(tasks, tasksExecutor, taskInputFiles = []) {
        this.tasks = tasks;
        this.tasksExecutor = tasksExecutor;
        this.taskInputFiles = taskInputFiles;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[Scheduler][${uuid.v1()}]`;
        this.addTask = (task) => {
            const { logPrefix } = this;
            const { name, cron } = task;
            this.logger.debug(`[Scheduler] - Creating cron task with name [${name}]. CronConfig: [${cron}]`, { logPrefix });
            if (!this.tasksExecutor.existsTask(name)) {
                this.logger.error(`[Scheduler] - Task [${name}] execution rules were not found`, { logPrefix });
                return false;
            }
            nodeCron.schedule(cron, () => __awaiter(this, void 0, void 0, function* () {
                const msg = new models_1.Message({});
                this.logger.trace(`[Scheduler][${name}] - Starting cron task with id [${msg.messageID}].`, { logPrefix });
                const { result } = yield this.tasksExecutor.execTask(msg, name);
                this.logger.trace(`[Scheduler][${name}] - Task result [${result}]`, { logPrefix });
            }));
            return true;
        };
        const { logPrefix } = this;
        this.loadAllTasks();
        this.logger.debug(`[Scheduler] - Scheduler module is up`, { logPrefix });
    }
    static getConfiguredInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tasksCrones, tasksNames } = AppPropsInstance_1.AppPropsInstance.getInstance().tasksScheduler;
            if (!tasksCrones || !tasksNames)
                throw new Error("Names and cron configs are required to start scheduler");
            const tasksCronesSplit = tasksCrones.split(",");
            const tasksNamesSplit = tasksNames.split(",");
            if (tasksCronesSplit.length !== tasksNamesSplit.length)
                throw new Error("The equal qty of task names and config are required");
            const tasksSchedules = tasksCronesSplit.map((taskCron, index) => {
                return { cron: taskCron, name: tasksNamesSplit[index] };
            });
            const { tasksFilePath, tasksReloadFileMode, tasksReloadFileInterval, tasksExtFunctionsFolderPath } = AppPropsInstance_1.AppPropsInstance.getInstance().tasksScheduler;
            const tasksExecutor = new TasksExecutor_1.TasksExecutor({
                transformFilePathList: tasksFilePath.split(","),
                reloadFileMode: tasksReloadFileMode,
                reloadFileInterval: tasksReloadFileInterval,
                applyDefaultRule: false,
                extensionFunctionsFolderPath: tasksExtFunctionsFolderPath,
            });
            yield tasksExecutor.initLoad();
            return new Scheduler(tasksSchedules, tasksExecutor);
        });
    }
    loadAllTasks() {
        this.tasks.forEach(this.addTask);
    }
}
exports.Scheduler = Scheduler;
