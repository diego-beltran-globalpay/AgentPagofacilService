"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SysLog = void 0;
const Logger_1 = require("./Logger");
const ain2_1 = __importDefault(require("ain2"));
class SysLog extends Logger_1.Logger {
    constructor(opts) {
        super();
        this.info = (line) => {
            this.logger.info(line);
        };
        this.debug = (line) => {
            this.logger.warn(line);
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
            process.exit(1);
        };
        const { logCategory, logHostname, logPort, logLevel } = opts;
        this.level = logLevel;
        this.logger = new ain2_1.default({
            tag: logCategory,
            hostname: logHostname,
            port: logPort,
        });
    }
}
exports.SysLog = SysLog;
