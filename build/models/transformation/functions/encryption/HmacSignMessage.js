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
exports.HmacSignMessage = void 0;
const crypto_1 = __importDefault(require("crypto"));
const HmacSignMessageITF_1 = require("./HmacSignMessageITF");
const HmacSignMessageITF_validator_1 = __importDefault(require("./HmacSignMessageITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class HmacSignMessage extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, clientKeySource, clientSecretSource, encoding } = this.props;
            const clientKey = this.accessor.get(clientKeySource, contexts);
            const clientSecret = this.accessor.get(clientSecretSource, contexts);
            const body = this.accessor.static.isContextRefStrict(fieldNameSource)
                ? this.accessor.static.getReference(fieldNameSource, contexts)
                : this.accessor.static.get(fieldNameSource, contexts);
            if (!clientKey || !clientSecret)
                throw new Error("Client secret and/or client key are empty");
            const value = crypto_1.default
                .createHmac("SHA256", clientSecret)
                .update(`${clientKey}${JSON.stringify(body)}`)
                .digest(encoding);
            this.logger.trace(`[ HmacSignMessage ] - The sign is [${value}]`, { logPrefix });
            return value;
        });
    }
}
exports.HmacSignMessage = HmacSignMessage;
HmacSignMessage.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, HmacSignMessageITF_1.fieldsNameMappigns, HmacSignMessageITF_validator_1.default);
    return new HmacSignMessage(params);
};
