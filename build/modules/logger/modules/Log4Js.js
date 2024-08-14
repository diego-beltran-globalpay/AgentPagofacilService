"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log4Js = void 0;
const fs_1 = __importDefault(require("fs"));
const log4js_1 = __importDefault(require("log4js"));
const Logger_1 = require("./Logger");
const logLevelRegex = new RegExp(/^(INFO|TRACE|DEBUG|ERROR|OFF|ALL|FATAL|WARN)$/);
const logCategoryRegex = new RegExp(/^([A-z])\w+$/);
const minLogFileMaxSize = 1000000;
const maxLogFileMaxSize = 1000000000;
const minLogFileMaxBackups = 0;
const maxLogFileMaxBackups = 100;
class Log4Js extends Logger_1.Logger {
    constructor(opts) {
        super();
        this.info = (line) => {
            this.logger.info(line);
        };
        this.debug = (line) => {
            this.logger.debug(line);
        };
        this.warn = (line) => {
            this.logger.warn(line);
        };
        this.trace = (line) => {
            this.logger.trace(line);
        };
        this.error = (line) => {
            this.logger.error(line);
        };
        this.fatal = (line) => {
            this.logger.fatal(line);
        };
        this.shutdown = (funct) => {
            if (!funct)
                funct = () => {
                    process.exit(1);
                };
            log4js_1.default.shutdown(funct);
        };
        this.chechOpts(opts);
        this.initLogger(opts);
    }
    chechOpts(opts) {
        let { logLevel } = opts;
        const { logConfig, logFileMaxSize, logFileMaxBackups, logCategory } = opts;
        if (!fs_1.default.existsSync(logConfig)) {
            logLevel = logLevel.toUpperCase();
            if (!logLevelRegex.test(logLevel)) {
                console.log(`[Log4Js] - The log level is not valid.`);
                throw new Error("The log level is not valid.");
            }
            if (logFileMaxSize < minLogFileMaxSize || logFileMaxSize > maxLogFileMaxSize) {
                console.log(`[Log4Js] - The log file max size is not valid.`);
                throw new Error("The log file max size is not valid.");
            }
            if (logFileMaxBackups < minLogFileMaxBackups || logFileMaxBackups > maxLogFileMaxBackups) {
                console.log(`[Log4Js] - The log file max backup quantity is not valid.`);
                throw new Error("The log file max backup quantity is not valid.");
            }
        }
        if (!logCategoryRegex.test(logCategory)) {
            console.log(`[Log4Js] - The log category is not valid.`);
            throw new Error("The log category is not valid.");
        }
    }
    initLogger(opts) {
        const { logConfig, logCategory } = opts;
        if (fs_1.default.existsSync(logConfig)) {
            log4js_1.default.configure(logConfig);
            this.logger = log4js_1.default.getLogger(logCategory);
            this.logger.debug("[Log4Js] - Se ha configurado al log4js gracias al archivo de configuracion especificado.");
            this.logger.debug(`[Log4Js] - File: ${logConfig}`);
        }
        else {
            const { logFilePath, logLevel, logFileMaxSize, logFileMaxBackups } = opts;
            log4js_1.default.configure({
                appenders: {
                    console: {
                        type: "console",
                    },
                    file1: {
                        type: "file",
                        filename: logFilePath,
                        maxLogSize: logFileMaxSize,
                        backups: logFileMaxBackups,
                        category: logCategory,
                    },
                },
                categories: {
                    default: {
                        appenders: ["file1", "console"],
                        level: logLevel,
                    },
                },
            });
            this.logger = log4js_1.default.getLogger(logCategory);
            this.logger.level = logLevel;
            this.logger.debug("[Log4Js] - Se ha configurado al log4js con la parametrizacion por default.");
        }
    }
    get level() {
        return this.logger.level.toString();
    }
}
exports.Log4Js = Log4Js;
