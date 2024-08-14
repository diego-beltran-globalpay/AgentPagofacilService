"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSA = void 0;
const crypto_1 = __importDefault(require("crypto"));
const node_rsa_1 = __importDefault(require("node-rsa"));
const fs_1 = __importDefault(require("fs"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
class RSA {
    constructor(publicKey, privateKey, format) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.format = format;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.keyLength = new node_rsa_1.default(this.privateKey.key.toString(), format, {}).getKeySize();
    }
    static fromFiles(publicKeyFilePath, privateKeyFilePath, format, padding, passphrase) {
        if (!fs_1.default.existsSync(publicKeyFilePath))
            throw new Error(`The public key file on [${publicKeyFilePath}] was not found`);
        if (!fs_1.default.existsSync(privateKeyFilePath))
            throw new Error(`The private key file on [${privateKeyFilePath}] was not found`);
        const pubKey = fs_1.default.readFileSync(publicKeyFilePath, "utf-8");
        const privKey = fs_1.default.readFileSync(privateKeyFilePath, "utf-8");
        return new RSA({ key: pubKey, padding }, { key: privKey, padding, passphrase }, format);
    }
    encrypt(buffer, blockLength = 200, options = {}) {
        const { logPrefix } = options;
        if (!buffer || !buffer.length)
            throw new Error("The buffer to encrypt is empty");
        let result = "", isEncrypting = true, count = 0, actualBlockLength;
        this.logger.trace(`[RSA][Encrypt] - Buffer to be encrypted[HEX]: ${buffer.toString("hex")}`, { logPrefix });
        while (isEncrypting) {
            actualBlockLength = blockLength;
            if (count + actualBlockLength >= buffer.length) {
                actualBlockLength = buffer.length - count;
                isEncrypting = false;
            }
            this.logger.trace(`[RSA][Encrypt] - Encrypting buffer from ${count} to ${count + actualBlockLength}`, { logPrefix });
            const partialBuff = Buffer.alloc(actualBlockLength);
            buffer.copy(partialBuff, 0, count, count + actualBlockLength);
            this.logger.trace(`[RSA][Encrypt] - Partial buffer to be encrypted[HEX]: ${partialBuff.toString("hex")}`, { logPrefix });
            this.logger.trace(`[RSA][Encrypt] - Partial buffer length: ${partialBuff.length}`, { logPrefix });
            const bufferEncrypted = crypto_1.default.publicEncrypt(this.publicKey, partialBuff);
            this.logger.trace(`[RSA][Encrypt] - Encrypted partial package[HEX]: ${bufferEncrypted.toString("hex")}`, { logPrefix });
            count += actualBlockLength;
            result += bufferEncrypted.toString("hex");
        }
        this.logger.trace(`[RSA][Encrypt] - Exit - Final encrypted package[HEX]: ${result}`, { logPrefix });
        return Buffer.from(result, "hex");
    }
    encryptString(value, type, resultEncoding, blockLength, options) {
        const buffer = Buffer.from(value.toString(), type);
        if (!buffer || !buffer.length)
            return "";
        return this.encrypt(buffer, blockLength, options).toString(resultEncoding);
    }
    decrypt(buffer, options = {}) {
        const { logPrefix } = options;
        if (!buffer || !buffer.length)
            throw new Error("The buffer to decrypt is empty");
        this.logger.trace(`[RSA][Decrypt] - Buffer to be decrypted [HEX]: [${buffer.toString("hex")}]`, { logPrefix });
        const result = [];
        let count = 0, length = 0, isEncrypting = true;
        while (isEncrypting) {
            length = this.keyLength / 8;
            if (count + length >= buffer.length) {
                length = buffer.length - count;
                isEncrypting = false;
            }
            const partialBuff = Buffer.alloc(length);
            buffer.copy(partialBuff, 0, count, count + length);
            this.logger.trace(`[RSA][Decrypt] - Buffer to be decrypted [HEX]: [${partialBuff.toString("hex")}]`, {
                logPrefix,
            });
            result.push(crypto_1.default.privateDecrypt(this.privateKey, partialBuff));
            count += length;
        }
        const resultBuffer = Buffer.concat(result);
        return resultBuffer;
    }
    decryptString(value, type, resultEncoding, options) {
        const { logPrefix } = options;
        const buffer = Buffer.from(value.toString(), type);
        if (!buffer || !buffer.length)
            return "";
        const resultBuffer = this.decrypt(buffer, options);
        const bufferFormated = resultBuffer.toString(resultEncoding);
        this.logger.trace(`[RSA][Decrypt] - Result [${resultEncoding}]: [${bufferFormated}]`, { logPrefix });
        return bufferFormated;
    }
}
exports.RSA = RSA;
