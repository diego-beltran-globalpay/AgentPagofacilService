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
exports.EncodeTLVs = void 0;
const EncodeTLVsITF_1 = require("./EncodeTLVsITF");
const EncodeTLVsITF_validator_1 = __importDefault(require("./EncodeTLVsITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class EncodeTLVs extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { finalMessage } = contexts;
            const { prefix, deleteTlvs, tlvType } = this.props;
            let encodedTlvs = "", tlvQty = 0;
            this.logger.debug(`[ EncodeTLVs ] - Encoding tlvs type [${tlvType}] with prefix [${prefix}]. Deleting the source after it: ${deleteTlvs}`, {
                logPrefix,
            });
            if (prefix && typeof prefix === "string") {
                for (const name in finalMessage) {
                    if (name.substr(0, prefix.length) === prefix) {
                        if (typeof finalMessage[name] !== "string")
                            throw new Error(`TLV value with key [${name}] is not string type`);
                        let tag = name.substr(prefix.length);
                        tag += ("0" + Number(finalMessage[name].length / 2).toString(16)).slice(-2).toUpperCase();
                        tag += finalMessage[name];
                        encodedTlvs += tag;
                        tlvQty++;
                        this.logger.trace(`[ EncodeTLVs ] - TLV [${name.substr(prefix.length)}] encoded.`, { logPrefix });
                        if (deleteTlvs)
                            delete finalMessage[name];
                    }
                }
                this.logger.trace(`[ EncodeTLVs ] - The final encoded tlvs is [${encodedTlvs}]`, { logPrefix });
                return encodedTlvs;
            }
            else {
                this.logger.error("[ EncodeTLVs ] - The prefix is not valid.", { logPrefix });
            }
        });
    }
}
exports.EncodeTLVs = EncodeTLVs;
EncodeTLVs.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, EncodeTLVsITF_1.fieldsNameMappigns, EncodeTLVsITF_validator_1.default);
    return new EncodeTLVs(params);
};
