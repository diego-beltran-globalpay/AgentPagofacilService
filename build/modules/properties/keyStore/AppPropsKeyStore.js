"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPropsKeyStore = void 0;
const KeyStore_1 = require("../../../models/keyStore/KeyStore");
const encryption_1 = require("../../../models/encryption");
const AppPropsInstance_1 = require("../AppPropsInstance");
class AppPropsKeyStore {
    static getInstance() {
        if (!this.instance) {
            const { secureStorePrivFilePath, secureStorePubFilePath, secureStoreKeyPassphrase, secureStoreKeysFormat, secureStoreKeysPadding, } = AppPropsInstance_1.AppPropsInstance.getInstance().appKeyStore;
            if (!secureStoreKeysFormat)
                throw new Error(`secureStoreKeysFormat must be set`);
            if (!secureStoreKeysPadding)
                throw new Error(`secureStoreKeysPadding must be set`);
            const rsaModule = encryption_1.RSA.fromFiles(secureStorePubFilePath, secureStorePrivFilePath, secureStoreKeysFormat, secureStoreKeysPadding, secureStoreKeyPassphrase);
            this.instance = new KeyStore_1.KeyStore(rsaModule, "secret:");
        }
        return this.instance;
    }
}
exports.AppPropsKeyStore = AppPropsKeyStore;
