"use strict";
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
exports.GenericDatabaseCtx = void 0;
const LoggersColletion_1 = require("../../../../modules/logger/LoggersColletion");
const InMemoryCtx_1 = require("../../memory/InMemoryCtx");
const db_1 = require("../../../db");
class GenericDatabaseCtx {
    constructor(options, expTime = 120, expProcessInterval = 15) {
        this.options = options;
        this.expTime = expTime;
        this.expProcessInterval = expProcessInterval;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.innerSetLogPrefix = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
            this.inMemoryCtx.setLogPrefix(this.logPrefix + "[Cache]");
        };
        const { connectionId } = this.options;
        if (!db_1.DbCollection.isConnectionCreated(connectionId))
            throw new Error(`Db connection with id [${connectionId}] is not configured.`);
        this.inMemoryCtx = new InMemoryCtx_1.InMemoryCtx(expTime, expProcessInterval);
    }
    addEntry(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { logPrefix } = this;
            this.logger.trace(`Creating new entry. Key: [${key}]`, { logPrefix });
            const { tableName, timeout, idFieldName, connectionId } = this.options;
            const connection = db_1.DbCollection.getWrappedConnectionById(connectionId);
            yield connection.addEntry(tableName, idFieldName, timeout, key, this.getFieldsForAddEntryQuery(data), logPrefix);
            this.inMemoryCtx.addEntry(key, data);
        });
    }
    updateEntry(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { logPrefix } = this;
            this.logger.trace(`Updating entry. Key: [${key}]`, { logPrefix });
            const { tableName, timeout, idFieldName, connectionId } = this.options;
            const connection = db_1.DbCollection.getWrappedConnectionById(connectionId);
            yield connection.updateEntry(tableName, idFieldName, timeout, key, this.getFieldsForAddEntryQuery(data), logPrefix);
            this.inMemoryCtx.updateEntry(key, data);
        });
    }
    getEntry(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const { logPrefix } = this;
            const entry = this.inMemoryCtx.getEntry(key);
            if (!entry) {
                const { tableName, timeout, idFieldName, connectionId } = this.options;
                const connection = db_1.DbCollection.getWrappedConnectionById(connectionId);
                const dataArray = yield connection.getEntry(tableName, idFieldName, timeout, key, logPrefix);
                if (dataArray && dataArray.length) {
                    this.inMemoryCtx.addEntry(key, this.getValuesFromGetEntryQuery(dataArray[0]));
                    return this.inMemoryCtx.getEntry(key);
                }
            }
            return entry;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const { logPrefix } = this;
            const { tableName, timeout, connectionId } = this.options;
            const connection = db_1.DbCollection.getWrappedConnectionById(connectionId);
            const dataArray = yield connection.getAll(tableName, timeout, logPrefix);
            return dataArray.map(element => {
                return { data: this.getValuesFromGetEntryQuery(element), createDateTime: new Date() };
            });
        });
    }
    deleteEntry(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tableName, timeout, idFieldName, connectionId } = this.options;
            const connection = db_1.DbCollection.getWrappedConnectionById(connectionId);
            const { logPrefix } = this;
            this.inMemoryCtx.deleteEntry(key);
            yield connection.deleteEntry(tableName, idFieldName, timeout, key, logPrefix);
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
exports.GenericDatabaseCtx = GenericDatabaseCtx;
