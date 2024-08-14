"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemcachedCtxsCollection = void 0;
const MemcachedCtx_1 = require("./MemcachedCtx");
class MemcachedCtxsCollection {
    static createInstance(name, address) {
        if (!this.instances[name])
            this.instances[name] = new MemcachedCtx_1.MemcachedCtx(address).setLogPrefix(`[${name}]`);
    }
    static existsInstance(name) {
        return !!this.instances[name];
    }
    static getInstance(name) {
        if (!this.instances[name])
            throw new Error(`You must create the MemcachedCtx instance [${name}] first!`);
        return this.instances[name];
    }
}
exports.MemcachedCtxsCollection = MemcachedCtxsCollection;
MemcachedCtxsCollection.instances = {};
