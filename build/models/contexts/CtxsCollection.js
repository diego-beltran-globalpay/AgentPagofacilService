"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtxsCollection = void 0;
const InMemoryCtxsCollection_1 = require("./memory/InMemoryCtxsCollection");
const MemcachedCtxsCollection_1 = require("./memcache/MemcachedCtxsCollection");
const DatabaseCtxsCollection_1 = require("./database/querys/DatabaseCtxsCollection");
const DatabaseSpCtxsCollection_1 = require("./database/storeProcedures/DatabaseSpCtxsCollection");
class CtxsCollection {
    static existsInstance(name) {
        return (!!InMemoryCtxsCollection_1.InMemoryCtxsCollection.getInstance(name) ||
            !!MemcachedCtxsCollection_1.MemcachedCtxsCollection.getInstance(name) ||
            !!DatabaseCtxsCollection_1.DatabaseCtxsCollection.getInstance(name) ||
            !!DatabaseSpCtxsCollection_1.DatabaseSpCtxsCollection.getInstance(name));
    }
    static getInstance(name) {
        if (InMemoryCtxsCollection_1.InMemoryCtxsCollection.existsInstance(name))
            return InMemoryCtxsCollection_1.InMemoryCtxsCollection.getInstance(name);
        if (MemcachedCtxsCollection_1.MemcachedCtxsCollection.existsInstance(name))
            return MemcachedCtxsCollection_1.MemcachedCtxsCollection.getInstance(name);
        if (DatabaseCtxsCollection_1.DatabaseCtxsCollection.existsInstance(name))
            return DatabaseCtxsCollection_1.DatabaseCtxsCollection.getInstance(name);
        if (DatabaseSpCtxsCollection_1.DatabaseSpCtxsCollection.existsInstance(name))
            return DatabaseSpCtxsCollection_1.DatabaseSpCtxsCollection.getInstance(name);
        throw new Error(`You must create the ctx instance [${name}] first!`);
    }
}
exports.CtxsCollection = CtxsCollection;
