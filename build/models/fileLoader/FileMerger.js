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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMerger = void 0;
const uuid = __importStar(require("uuid"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
class FileMerger {
    constructor(files) {
        this.files = files;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[FileMerger][${uuid.v1()}]`;
        this.mergedFile = null;
        this.setLogPrexix = (newLogPrefix) => {
            this.logPrefix = newLogPrefix;
        };
    }
    loadFiles(localLogPrefix) {
        const logPrefix = localLogPrefix || this.logPrefix;
        const changeFound = this.files.some(file => file.load());
        if (changeFound) {
            this.logger.debug("[loadFiles] - Loading files and putting them into only one file", { logPrefix });
            let anyFileFound = false;
            const newFile = this.files.reduce((tmpFile, file) => {
                try {
                    const fileContent = file.getContent("utf-8");
                    if (fileContent) {
                        const jsonFile = this.validateFile(fileContent);
                        this.logger.trace(`[loadFiles] - The file [${file.getPath()}] was converted to JSON object`, { logPrefix });
                        tmpFile = !anyFileFound ? this.mergeFiles(tmpFile, jsonFile) : jsonFile;
                        this.logger.trace(`[loadFiles] - The file [${file.getPath()}] was merged`, { logPrefix });
                        anyFileFound = true;
                    }
                }
                catch (error) {
                    this.logger.error(`[loadFiles] - The file [${file.getPath()}] could NOT be load.`, { logPrefix });
                    this.logger.error(error, { logPrefix });
                }
                return tmpFile;
            }, {});
            return anyFileFound ? newFile : null;
        }
        else {
            this.logger.debug("[loadFiles] - No changes were detected on files", { logPrefix });
            return null;
        }
    }
}
exports.FileMerger = FileMerger;
