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
exports.InMemoryCtx = void 0;
const uuid = __importStar(require("uuid"));
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
class InMemoryCtx {
    constructor(expTime = 120, expProcessInterval = 15) {
        this.expTime = expTime;
        this.expProcessInterval = expProcessInterval;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[InMemoryCtx][${uuid.v1()}]`;
        this.vault = {};
        this.setLogPrefix = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
            return this;
        };
        this.expTime = expTime * 1000;
        setInterval(() => {
            this.dropExpiredEntries();
        }, expProcessInterval * 1000);
    }
    addEntry(key, data) {
        if (key) {
            this.logger.trace(`Creating new entry. Key: [${key}]`, { logPrefix: this.logPrefix });
            this.vault[key] = {
                data,
                createDateTime: new Date(),
            };
        }
    }
    getAll() {
        const now = new Date().getTime();
        return Object.values(this.vault).filter(entry => entry.createDateTime && entry.createDateTime.getTime() + this.expTime > now);
    }
    getEntry(key) {
        const entry = this.vault[key] || {};
        const now = new Date().getTime();
        if (entry.createDateTime && entry.createDateTime.getTime() + this.expTime > now) {
            return entry;
        }
    }
    updateEntry(key, data) {
        const entry = this.vault[key] || {};
        const now = new Date().getTime();
        if (entry.createDateTime && entry.createDateTime.getTime() + this.expTime > now) {
            this.vault[key] = {
                data: typeof entry.data === "object" ? Object.assign(Object.assign({}, entry.data), data) : data,
                createDateTime: new Date(),
            };
        }
    }
    deleteEntry(key) {
        delete this.vault[key];
    }
    dropExpiredEntries() {
        const { logPrefix } = this;
        const now = new Date().getTime();
        this.logger.debug("Starting expired entry dropping process.", { logPrefix });
        for (const entryKey in this.vault) {
            const entry = this.vault[entryKey];
            if (!entry.createDateTime || entry.createDateTime.getTime() + this.expTime < now) {
                this.logger.trace(`Dropping entry from context. Key: [${entryKey}]`, { logPrefix });
                delete this.vault[entryKey];
            }
        }
        this.logger.debug("Expired entry dropping process was completed", { logPrefix });
    }
}
exports.InMemoryCtx = InMemoryCtx;
