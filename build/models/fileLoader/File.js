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
exports.File = void 0;
const fs_1 = __importDefault(require("fs"));
const uuid = __importStar(require("uuid"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
class File {
    constructor(path, formatter, encoding, wildcard1, wildcard2) {
        this.path = path;
        this.formatter = formatter;
        this.encoding = encoding;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.hash = null;
        this.content = null;
        this.parsedContent = null;
        this.hasChanged = false;
        this.logPrefix = `[${uuid.v1()}][File]`;
        this.setParentLogPrefix = (logPrefix) => {
            this.logPrefix = logPrefix;
            return this;
        };
        this.hasChangedSinceLastCheck = () => {
            const tmp = this.hasChanged;
            this.hasChanged = false;
            return tmp;
        };
        this.load = (forcedLogPrefix) => {
            const { logPrefix: innerLogPrefix } = this;
            const logPrefix = forcedLogPrefix || innerLogPrefix;
            if (!fs_1.default.existsSync(this.path)) {
                this.logger.error(`[${this.path}] - The file was not found${this.content ? " anymore" : ""}.`, { logPrefix });
                this.hasChanged = false;
                return this.hasChanged;
            }
            const fileBuffer = fs_1.default.readFileSync(this.path);
            const fileString = fileBuffer.toString(this.encryptionMod ? "base64" : this.encoding);
            const newHash = crypto_js_1.default.SHA256(fileString).toString(crypto_js_1.default.enc.Base64);
            if (this.hash && this.hash === newHash) {
                this.logger.trace(`[${this.path}] - The file was not changed.`, { logPrefix });
                this.hasChanged = false;
            }
            else {
                this.hash = newHash;
                this.content = this.encryptionMod ? this.encryptionMod.decrypt(fileBuffer) : fileBuffer;
                this.parsedContent = this.formatter.bufferDecode(this.content, this.encoding);
                this.logger.trace(`[${this.path}] - The file was changed.`, { logPrefix });
                this.hasChanged = true;
            }
            return this.hasChanged;
        };
        this.getPath = () => this.path;
        this.getBufferContent = () => this.content;
        this.getContent = (encoding) => {
            if (!this.content)
                return null;
            return encoding && encoding !== this.encoding ? this.formatter.bufferDecode(this.content, encoding) : this.parsedContent;
        };
        if (wildcard1) {
            if (typeof wildcard1 === "number") {
                this.reloadInterval = wildcard1;
                setInterval(this.load, this.reloadInterval);
            }
            else {
                this.encryptionMod = wildcard1;
            }
        }
        if (wildcard2)
            this.encryptionMod = wildcard2;
    }
}
exports.File = File;
