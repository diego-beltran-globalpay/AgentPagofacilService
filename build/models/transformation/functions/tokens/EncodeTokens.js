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
exports.EncodeTokens = void 0;
const EncodeTokensITF_1 = require("./EncodeTokensITF");
const EncodeTokensITF_validator_1 = __importDefault(require("./EncodeTokensITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const Strings_1 = require("../../../../modules/utils/types/Strings");
const NamedFields_1 = require("../../../utils/NamedFields");
class EncodeTokens extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { sourceRef, tokenType, prefix, deleteTokens, convertFrom, convertTo } = this.props;
            this.logger.debug(`[ EncodeTokens ] - Encoding tokens type [${tokenType}] with prefix [${prefix}]`, { logPrefix });
            if (!prefix)
                throw new Error("The prefix has to be present.");
            let header = "", encodedTokens = "", tokenQty = 0;
            const reference = (yield this.accessor.static.getReference(sourceRef, contexts));
            switch (tokenType) {
                case EncodeTokensITF_1.TokenTypes.Zero:
                case EncodeTokensITF_1.TokenTypes.One:
                case EncodeTokensITF_1.TokenTypes.Three:
                    for (const name in reference) {
                        if (name.substr(0, prefix.length) === prefix) {
                            let token = "";
                            token += "!";
                            token += " ";
                            token += name.substr(prefix.length);
                            token += Strings_1.Strings.paddField(reference[name].length, "0", 5, "L");
                            token += " ";
                            token += reference[name];
                            tokenQty++;
                            encodedTokens += token;
                            this.logger.trace(`[ EncodeTokens ] - Token [${name.substr(prefix.length)}] encoded.`, { logPrefix });
                            if (deleteTokens)
                                delete reference[name];
                        }
                    }
                    if (tokenType === EncodeTokensITF_1.TokenTypes.One) {
                        header += "&";
                        header += " ";
                        header += Strings_1.Strings.paddField(tokenQty.toString(), "0", 5, "L");
                        header += Strings_1.Strings.paddField((encodedTokens.length + 12).toString(), "0", 5, "L");
                        this.logger.trace(`[ EncodeTokens ] - Header [${header}] encoded.`, { logPrefix });
                    }
                    else if (EncodeTokensITF_1.TokenTypes.Three) {
                        header += "&";
                        header += " ";
                        header += Strings_1.Strings.paddField((tokenQty + 1).toString(), "0", 5, "L");
                        header += Strings_1.Strings.paddField((encodedTokens.length + 12).toString(), "0", 5, "L");
                        this.logger.trace(`[ EncodeTokens ] - Header [${header}] encoded.`, { logPrefix });
                    }
                    this.logger.trace(`[ EncodeTokens ] - The final encoded tokens is [${header + encodedTokens}]`, { logPrefix });
                    return header + encodedTokens;
                case EncodeTokensITF_1.TokenTypes.Two:
                    for (const tokenFullName in reference) {
                        const tokenName = tokenFullName.substr(0, prefix.length);
                        if (tokenName.substr(0, prefix.length) === prefix) {
                            let tokenValue = reference[tokenFullName];
                            if (tokenValue && typeof tokenValue === "string") {
                                let token = Strings_1.Strings.paddField(tokenValue.length.toString(), "0", 4, "L");
                                if (convertFrom && convertTo) {
                                    tokenValue = Buffer.from(tokenValue, convertFrom).toString(convertTo);
                                    this.logger.trace(`[ EncodeTokens ] - Token [${tokenName}] found. The value is [${tokenValue}] converted`, {
                                        logPrefix,
                                    });
                                }
                                token += tokenValue;
                                tokenQty++;
                                encodedTokens += token;
                                this.logger.trace(`[ EncodeTokens ] - Token [${tokenName.substr(prefix.length)}] encoded.`, { logPrefix });
                                if (deleteTokens)
                                    delete reference[tokenName];
                            }
                            else {
                                this.logger.trace(`[ EncodeTokens ] - The token value ${tokenName} was not found`, { logPrefix });
                            }
                        }
                    }
                    header += Strings_1.Strings.paddField(tokenQty.toString(16), "0", 2, "L");
                    this.logger.trace(`[ EncodeTokens ] - Header [${header}] encoded.`, { logPrefix });
                    this.logger.trace(`[ EncodeTokens ] - The final encoded tokens is [${header + encodedTokens}]`, { logPrefix });
                    return header + encodedTokens;
                default:
                    throw new Error("The token type chosen is not supported.");
            }
        });
    }
}
exports.EncodeTokens = EncodeTokens;
EncodeTokens.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, EncodeTokensITF_1.fieldsNameMappigns, EncodeTokensITF_validator_1.default);
    return new EncodeTokens(params);
};
