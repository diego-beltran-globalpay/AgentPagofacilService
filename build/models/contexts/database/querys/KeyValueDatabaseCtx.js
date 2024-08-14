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
exports.KeyValueDatabaseCtx = void 0;
const uuid = __importStar(require("uuid"));
const GenericDatabaseCtx_1 = require("./GenericDatabaseCtx");
class KeyValueDatabaseCtx extends GenericDatabaseCtx_1.GenericDatabaseCtx {
    constructor(options, expTime = 120, expProcessInterval = 15) {
        super(options, expTime, expProcessInterval);
        this.logPrefix = `[KeyValueDatabaseCtx][${uuid.v1()}]`;
        this.setLogPrefix = (logPrefixNew) => {
            this.innerSetLogPrefix(logPrefixNew);
            return this;
        };
        this.getFieldsForAddEntryQuery = (data) => {
            const { valueFieldName = "value" } = this.options;
            return { [valueFieldName]: this.serialize(data) };
        };
        this.getValuesFromGetEntryQuery = (data) => {
            const { valueFieldName = "value" } = this.options;
            return this.deserialize(data[valueFieldName]);
        };
        this.inMemoryCtx.setLogPrefix(this.logPrefix + "[Cache]");
    }
}
exports.KeyValueDatabaseCtx = KeyValueDatabaseCtx;