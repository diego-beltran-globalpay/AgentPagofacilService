"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeDesECBEncrypt = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
const _3DesECBEncryptITF_1 = require("./3DesECBEncryptITF");
const _3DesECBEncryptITF_validator_1 = __importDefault(require("./3DesECBEncryptITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class ThreeDesECBEncrypt extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, keyFieldName } = this.props;
            const data = yield this.accessor.get(fieldNameSource, contexts);
            const key = yield this.accessor.get(keyFieldName, contexts);
            this.logger.trace(`[ ThreeDesECBEncrypt ] - Data source name: ${fieldNameSource} - Data to encrypt: [${data}]`, { logPrefix });
            this.logger.trace(`[ ThreeDesECBEncrypt ] - Key source name: ${keyFieldName} - Key: [${key}]`, { logPrefix });
            const cipher = node_forge_1.default.cipher.createCipher("3DES-ECB", Buffer.from(key, "hex").toString("binary"));
            cipher.start();
            cipher.update(node_forge_1.default.util.createBuffer(Buffer.from(data, "hex").toString("binary")));
            cipher.finish();
            const encrypted = Buffer.from(cipher.output.getBytes(), "binary").toString("hex");
            return encrypted;
        });
    }
}
exports.ThreeDesECBEncrypt = ThreeDesECBEncrypt;
ThreeDesECBEncrypt.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, _3DesECBEncryptITF_1.fieldsNameMappigns, _3DesECBEncryptITF_validator_1.default);
    return new ThreeDesECBEncrypt(params);
};
