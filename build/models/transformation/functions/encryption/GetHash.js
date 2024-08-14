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
exports.GetHash = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const GetHashITF_1 = require("./GetHashITF");
const GetHashITF_validator_1 = __importDefault(require("./GetHashITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetHash extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, hashType } = this.props;
            this.logger.trace(`[ GetHash ] - Field name source: ${fieldNameSource}`, { logPrefix });
            const source = yield this.accessor.get(fieldNameSource, contexts);
            if (!source) {
                this.logger.trace("[ GetHash ] - Field value is empty. GetHash not applied.", { logPrefix });
                return undefined;
            }
            const result = crypto_js_1.default[hashType](source).toString(crypto_js_1.default.enc.Hex);
            return result;
        });
    }
}
exports.GetHash = GetHash;
GetHash.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetHashITF_1.fieldsNameMappigns, GetHashITF_validator_1.default);
    return new GetHash(params);
};
