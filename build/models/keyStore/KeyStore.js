"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyStore = void 0;
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
class KeyStore {
    constructor(encryption, prefixToUse) {
        this.encryption = encryption;
        this.prefixToUse = prefixToUse;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.isSecretRegExp = new RegExp(`^${prefixToUse}`);
    }
    isSecret(param) {
        return !!param && this.isSecretRegExp.test(param);
    }
    decryptSecret(value, options) {
        const { logPrefix } = options;
        if (this.isSecret(value)) {
            this.logger.trace(`[KeyStore][DecryptSecret] - Decrypting value [${value}]`, { logPrefix });
            value = this.prefixToUse ? value.substr(this.prefixToUse.length) : value;
            return this.encryption.decryptString(value, "base64", "utf-8", options);
        }
        else {
            throw new Error(`The value rcv [${value}] is not a valid one to decrypt. It must start with a [${this.prefixToUse}] prefix!!`);
        }
    }
}
exports.KeyStore = KeyStore;
