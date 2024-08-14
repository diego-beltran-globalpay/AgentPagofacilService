"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyStoresCollection = void 0;
const KeyStore_1 = require("./KeyStore");
class KeyStoresCollection {
    static getNewInstance(id, prefixToUse, encryption) {
        const instances = this.instances || {};
        instances[id] = new KeyStore_1.KeyStore(encryption, prefixToUse);
        this.instances = instances;
        return instances[id];
    }
    static getInstance(id) {
        if (this.instances[id])
            throw new Error(`The KeyStore with id ${id} was not found`);
        return this.instances[id];
    }
}
exports.KeyStoresCollection = KeyStoresCollection;
KeyStoresCollection.instances = {};
