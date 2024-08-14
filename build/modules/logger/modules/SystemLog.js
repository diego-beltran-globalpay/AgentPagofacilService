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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLog = void 0;
const os_1 = __importDefault(require("os"));
const Logger_1 = require("./Logger");
class SystemLog extends Logger_1.Logger {
    constructor(opts) {
        super();
        this.info = (line) => {
            this.logger.info(line);
        };
        this.debug = (line) => {
            this.logger.info(line);
        };
        this.warn = (line) => {
            this.logger.info(line);
        };
        this.trace = (line) => {
            this.logger.info(line);
        };
        this.error = (line) => {
            this.logger.info(line);
        };
        this.fatal = (line) => {
            this.logger.info(line);
        };
        this.shutdown = (funct) => {
            process.exit(1);
        };
        const { logCategory, logLevel } = opts;
        this.level = logLevel;
        switch (os_1.default.type()) {
            case "Linux":
                Promise.resolve().then(() => __importStar(require("node-linux"))).then((systemlog) => {
                    this.logger = new systemlog.EventLogger(logCategory);
                });
                break;
            case "Darwin":
                Promise.resolve().then(() => __importStar(require("node-mac"))).then((systemlog) => {
                    this.logger = new systemlog.EventLogger(logCategory);
                });
                break;
            case "Windows_NT":
            default:
                Promise.resolve().then(() => __importStar(require("node-windows"))).then((systemlog) => {
                    this.logger = new systemlog.EventLogger(logCategory);
                });
                break;
        }
    }
}
exports.SystemLog = SystemLog;
