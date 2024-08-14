"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseCtxsCollection = void 0;
const DatabaseCtxConfigsITF_1 = require("../DatabaseCtxConfigsITF");
const FieldsDatabaseCtx_1 = require("./FieldsDatabaseCtx");
const KeyValueDatabaseCtx_1 = require("./KeyValueDatabaseCtx");
class DatabaseCtxsCollection {
    static createInstance(name, options) {
        if (!this.instances[name]) {
            this.instances[name] =
                options.mode === DatabaseCtxConfigsITF_1.DbOpModes.FIELDS
                    ? new FieldsDatabaseCtx_1.FieldsDatabaseCtx(options).setLogPrefix(`[${name}]`)
                    : new KeyValueDatabaseCtx_1.KeyValueDatabaseCtx(options).setLogPrefix(`[${name}]`);
        }
    }
    static existsInstance(name) {
        return !!this.instances[name];
    }
    static getInstance(name) {
        if (!this.instances[name])
            throw new Error(`You must create the DatabaseCtx instance [${name}] first!`);
        return this.instances[name];
    }
}
exports.DatabaseCtxsCollection = DatabaseCtxsCollection;
DatabaseCtxsCollection.instances = {};
