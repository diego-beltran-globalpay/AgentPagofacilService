"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCtxsCollection = void 0;
const InMemoryCtx_1 = require("./InMemoryCtx");
class InMemoryCtxsCollection {
    static createInstance(name) {
        if (!this.instances[name])
            this.instances[name] = new InMemoryCtx_1.InMemoryCtx().setLogPrefix(`[${name}]`);
    }
    static existsInstance(name) {
        return !!this.instances[name];
    }
    static getInstance(name) {
        if (!this.instances[name])
            throw new Error(`You must create the InMemoryCtx instance [${name}] first!`);
        return this.instances[name];
    }
}
exports.InMemoryCtxsCollection = InMemoryCtxsCollection;
InMemoryCtxsCollection.instances = {};
