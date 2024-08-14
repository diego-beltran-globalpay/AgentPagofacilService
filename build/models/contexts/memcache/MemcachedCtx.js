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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemcachedCtx = void 0;
const uuid = __importStar(require("uuid"));
const memjs_1 = __importDefault(require("memjs"));
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const InMemoryCtx_1 = require("../memory/InMemoryCtx");
class MemcachedCtx {
    constructor(address, expTime = 120, expProcessInterval = 15) {
        this.address = address;
        this.expTime = expTime;
        this.expProcessInterval = expProcessInterval;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[MemcachedCtx][${uuid.v1()}]`;
        this.setLogPrefix = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
            this.inMemoryCtx.setLogPrefix(this.logPrefix + "[Cache]");
            return this;
        };
        this.source = memjs_1.default.Client.create(this.address);
        this.inMemoryCtx = new InMemoryCtx_1.InMemoryCtx(expTime, expProcessInterval);
        this.inMemoryCtx.setLogPrefix(this.logPrefix + "[Cache]");
    }
    addEntry(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { logPrefix } = this;
            this.logger.trace(`Creating new entry. Key: [${key}]`, { logPrefix });
            yield this.source.set(key, this.serialize(data), {});
            this.inMemoryCtx.addEntry(key, data);
        });
    }
    getEntry(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = this.inMemoryCtx.getEntry(key);
            if (!entry) {
                const data = yield this.source.get(key);
                if (data.value) {
                    this.inMemoryCtx.addEntry(key, this.deserialize(data.value.toString()));
                    return this.inMemoryCtx.getEntry(key);
                }
            }
            return entry;
        });
    }
    updateEntry(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = this.inMemoryCtx.getEntry(key);
            if (!entry) {
                const prevData = yield this.source.get(key);
                if (prevData.value) {
                    const prevDataParsed = this.deserialize(prevData.value.toString());
                    const newData = typeof prevDataParsed === "object" ? Object.assign(Object.assign({}, prevDataParsed), data) : data;
                    yield this.source.set(key, this.serialize(newData), {});
                    this.inMemoryCtx.addEntry(key, newData);
                }
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    deleteEntry(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.inMemoryCtx.deleteEntry(key);
            this.source.delete(key);
        });
    }
    serialize(data) {
        switch (typeof data) {
            case "object":
                return JSON.stringify(data);
            default:
                return String(data);
        }
    }
    deserialize(data) {
        if (!isNaN(parseFloat(data)))
            return parseFloat(data);
        else if (data === "true")
            return true;
        else if (data === "false")
            return false;
        else {
            try {
                return JSON.parse(data);
            }
            catch (error) { }
            return data;
        }
    }
}
exports.MemcachedCtx = MemcachedCtx;
