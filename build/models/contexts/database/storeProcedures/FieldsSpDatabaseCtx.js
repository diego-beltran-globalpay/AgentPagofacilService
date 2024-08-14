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
exports.FieldsSpDatabaseCtx = void 0;
const uuid = __importStar(require("uuid"));
const GenericSpDatabaseCtx_1 = require("./GenericSpDatabaseCtx");
class FieldsSpDatabaseCtx extends GenericSpDatabaseCtx_1.GenericSpDatabaseCtx {
    constructor(options, expTime = 120, expProcessInterval = 15) {
        super(options, expTime, expProcessInterval);
        this.logPrefix = `[FieldsSpDatabaseCtx][${uuid.v1()}]`;
        this.setLogPrefix = (logPrefixNew) => {
            this.innerSetLogPrefix(logPrefixNew);
            return this;
        };
        this.getFieldsForAddEntryQuery = (data) => {
            return Object.values(data);
        };
        this.getValuesFromGetEntryQuery = (data) => {
            const { idFieldName } = this.options;
            return Object.assign(Object.assign({}, data), { [idFieldName]: undefined });
        };
        this.inMemoryCtx.setLogPrefix(this.logPrefix + "[Cache]");
    }
}
exports.FieldsSpDatabaseCtx = FieldsSpDatabaseCtx;
