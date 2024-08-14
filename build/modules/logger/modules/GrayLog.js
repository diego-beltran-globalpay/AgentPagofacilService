"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrayLog = void 0;
const graylog2_1 = __importDefault(require("graylog2"));
const Logger_1 = require("./Logger");
class GrayLog extends Logger_1.Logger {
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
            this.logger.debug(line);
        };
        this.error = (line) => {
            this.logger.error(line);
        };
        this.fatal = (line) => {
            this.logger.error(line);
        };
        this.shutdown = (funct) => {
            if (!funct)
                funct = () => {
                    process.exit(1);
                };
            this.logger.close(funct);
        };
        const { logNodeName, logHostname, logPort, logCategory, logBufferSize, logLevel } = opts;
        this.level = logLevel;
        this.logger = new graylog2_1.default.graylog({
            servers: [{ host: logHostname, port: logPort }],
            hostname: logNodeName,
            facility: logCategory,
            bufferSize: logBufferSize,
        });
    }
}
exports.GrayLog = GrayLog;
