"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerInstance = exports.LoggersCollection = void 0;
const modules_1 = require("./modules");
var logModuleTypes;
(function (logModuleTypes) {
    logModuleTypes["log4js"] = "log4js";
    logModuleTypes["syslog"] = "syslog";
    logModuleTypes["graylog"] = "graylog";
    logModuleTypes["systemlog"] = "systemlog";
})(logModuleTypes || (logModuleTypes = {}));
class LoggersCollection {
    constructor(opts) {
        this.opts = opts;
        this.loggers = [];
        this.logAdditionalTokensArray = [];
        this.info = (line, object) => {
            this.logLine(modules_1.LoggerLevels.info, line, object);
        };
        this.debug = (line, object) => {
            this.logLine(modules_1.LoggerLevels.debug, line, object);
        };
        this.trace = (line, object) => {
            this.logLine(modules_1.LoggerLevels.trace, line, object);
        };
        this.warn = (line, object) => {
            this.logLine(modules_1.LoggerLevels.warn, line, object);
        };
        this.fatal = (line, object) => {
            this.logLine(modules_1.LoggerLevels.fatal, line, object);
        };
        this.error = (line, object) => {
            this.logLine(modules_1.LoggerLevels.error, line, object);
        };
        this.logLine = (level, line, object) => {
            const lineToAdd = this.getTokenValues(object);
            this.loggers.forEach(logger => {
                logger[level](`${lineToAdd}${line}`);
            });
        };
        const { logAdditionalTokens, logModule } = opts;
        if (logAdditionalTokens)
            this.logAdditionalTokensArray = logAdditionalTokens.split(",");
        this.logAdditionalTokensArray.unshift("logPrefix");
        logModule.split(",").forEach(moduleName => {
            switch (moduleName) {
                case logModuleTypes.syslog:
                    this.loggers.push(new modules_1.SysLog(opts));
                    break;
                case logModuleTypes.graylog:
                    this.loggers.push(new modules_1.GrayLog(opts));
                    break;
                case logModuleTypes.systemlog:
                    this.loggers.push(new modules_1.SystemLog(opts));
                    break;
                case logModuleTypes.log4js:
                    this.loggers.push(new modules_1.Log4Js(opts));
                    break;
                default:
                    throw new Error("One of the log module is not valid.");
            }
        });
    }
    shutdown(funct) {
        return this.loggers[0].shutdown(funct);
    }
    get level() {
        return this.loggers[0].level;
    }
    getTokenValues(object = {}) {
        const result = this.logAdditionalTokensArray.reduce((lineToAdd, token) => {
            lineToAdd += object[token] ? `[${object[token]}]` : "";
            return lineToAdd;
        }, "");
        return result ? result + " - " : "";
    }
}
exports.LoggersCollection = LoggersCollection;
class LoggerInstance {
    static isIniated() {
        return !!this.instance;
    }
    static getInstance(props) {
        if (!this.instance) {
            if (!props)
                throw new Error("You need to pass the loggers properties the first time.");
            else
                this.instance = new LoggersCollection(props);
        }
        return this.instance;
    }
}
exports.LoggerInstance = LoggerInstance;
