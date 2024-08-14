"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSpCtxsCollection = void 0;
const DatabaseCtxConfigsITF_1 = require("../DatabaseCtxConfigsITF");
const FieldsSpDatabaseCtx_1 = require("./FieldsSpDatabaseCtx");
const KeyValueSpDatabaseCtx_1 = require("./KeyValueSpDatabaseCtx");
class DatabaseSpCtxsCollection {
    static createInstance(name, options) {
        if (!this.instances[name]) {
            this.instances[name] =
                options.mode === DatabaseCtxConfigsITF_1.DbOpModes.FIELDS
                    ? new FieldsSpDatabaseCtx_1.FieldsSpDatabaseCtx(options).setLogPrefix(`[${name}]`)
                    : new KeyValueSpDatabaseCtx_1.KeyValueSpDatabaseCtx(options).setLogPrefix(`[${name}]`);
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
exports.DatabaseSpCtxsCollection = DatabaseSpCtxsCollection;
DatabaseSpCtxsCollection.instances = {};
