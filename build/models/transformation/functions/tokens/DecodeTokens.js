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
exports.DecodeTokens = void 0;
const DecodeTokensITF_1 = require("./DecodeTokensITF");
const DecodeTokensITF_validator_1 = __importDefault(require("./DecodeTokensITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class DecodeTokens extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            //const { fieldNameSource, tokenType, prefix, dest = "S", convertFrom = "none", convertTo = "none" } = this.props;
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, tokenType, prefix, resultDest, convertFrom, convertTo } = this.props;
            this.logger.debug(`[ DecodeTokens ] - Decoding tokens type [${tokenType}] from [${fieldNameSource}] with prefix [${prefix}] Contert from ${convertFrom} to ${convertTo}`, { logPrefix });
            const fieldValue = yield this.accessor.get(fieldNameSource, contexts);
            // Nos aseguramos de que el campo sea un string, y no un numero, si es distinto de undefined
            if (!fieldValue)
                throw new Error(`The field with name ${fieldValue} is empty`);
            // eslint-disable-next-line no-unused-vars
            let actualPos = 0, tokensQty, tokensLength, eyeCatcher, separador, tokenCounter;
            switch (tokenType) {
                case DecodeTokensITF_1.TokenTypes.One:
                case DecodeTokensITF_1.TokenTypes.Three:
                    eyeCatcher = fieldValue.substr(actualPos, 1);
                    actualPos += 1;
                    separador = fieldValue.substr(actualPos, 1);
                    actualPos += 1;
                    tokensQty = parseInt(fieldValue.substr(actualPos, 5));
                    actualPos += 5;
                    if (tokenType === "3" && tokensQty > 0)
                        tokensQty--;
                    tokensLength = parseInt(fieldValue.substr(actualPos, 5));
                    actualPos += 5;
                    if (eyeCatcher !== "&" || separador !== " " || tokensQty === 0 || tokensLength === 0) {
                        this.logger.warn(`[ DecodeTokens ] - The field ${fieldValue} is not well-fromatted or it has not any token available.`, { logPrefix });
                        throw new Error(`The field ${fieldValue} is not well-fromatted or it has not any token available.`);
                    }
                // Intencionalmente no se coloca un break aqui.
                // Si es del tipo 1, se avanza sobre un header inicial
                // Si es del tipo 0, directamente avanzamos sobre headers en cada uno de los tokens
                // eslint-disable-next-line no-fallthrough
                case DecodeTokensITF_1.TokenTypes.Zero:
                    while (actualPos < fieldValue.length) {
                        const eyeCatcherT = fieldValue.substr(actualPos, 1);
                        actualPos += 1;
                        const userFld1 = fieldValue.substr(actualPos, 1);
                        actualPos += 1;
                        if (eyeCatcherT !== "!" || userFld1 !== " ") {
                            this.logger.warn("[ DecodeTokens ] - We found a token that is not well-formatted. We will not use it.", {
                                logPrefix,
                            });
                            continue;
                        }
                        const tokenName = fieldValue.substr(actualPos, 2);
                        actualPos += 2;
                        const tokenLength = fieldValue.substr(actualPos, 5);
                        actualPos += 5;
                        //let userFld2    = field.substr( actualPos, 1 );
                        actualPos += 1;
                        let tokenValue = fieldValue.substr(actualPos, parseInt(tokenLength));
                        actualPos += parseInt(tokenLength);
                        this.logger.trace(`[ DecodeTokens ] - Token [${tokenName}] found. The value is [${tokenValue}]`, { logPrefix });
                        if (convertFrom) {
                            tokenValue = tokenValue.toString();
                            const auxBuffer = Buffer.from(tokenValue, convertFrom);
                            tokenValue = auxBuffer.toString(convertTo);
                            this.logger.trace(`[ DecodeTokens ] - Token [${tokenName}] found. The value is [${tokenValue}] converted`, {
                                logPrefix,
                            });
                        }
                        yield this.accessor.set(`${resultDest}${prefix}${tokenName}`, tokenValue, contexts);
                    }
                    break;
                case DecodeTokensITF_1.TokenTypes.Three: // dd fields + [ [ dddd longitud de la data + [ data ] ... ] -- Full Carga
                    tokensQty = parseInt(fieldValue.substr(actualPos, 2), 16);
                    actualPos += 2;
                    if (tokensQty === 0) {
                        this.logger.warn(`[ DecodeTokens ] - The field ${fieldValue} is not well-fromatted or it has not any token available.`, { logPrefix });
                        throw new Error(`The field ${fieldValue} is not well-fromatted or it has not any token available.`);
                    }
                    tokenCounter = 0;
                    while (actualPos < fieldValue.length && tokenCounter < tokensQty) {
                        const tokenName = ("00" + tokenCounter).slice(-2);
                        const tokenLength = parseInt(fieldValue.substr(actualPos, 4)) * 2;
                        actualPos += 4;
                        let tokenValue = fieldValue.substr(actualPos, tokenLength);
                        actualPos += tokenLength;
                        this.logger.trace(`[ DecodeTokens ] - Token [${tokenName}] found. The value is [${tokenValue}]`, { logPrefix });
                        if (convertFrom) {
                            tokenValue = tokenValue.toString();
                            const auxBuffer = Buffer.from(tokenValue, convertFrom);
                            tokenValue = auxBuffer.toString(convertTo);
                            this.logger.trace(`[ DecodeTokens ] - Token [${tokenName}] found. The value is [${tokenValue}] converted`, {
                                logPrefix,
                            });
                        }
                        yield this.accessor.set(`${resultDest}${prefix}${tokenName}`, tokenValue, contexts);
                        tokenCounter++;
                    }
                    break;
                default:
                    throw new Error("The token type chosen is not supported.");
            }
        });
    }
}
exports.DecodeTokens = DecodeTokens;
DecodeTokens.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, DecodeTokensITF_1.fieldsNameMappigns, DecodeTokensITF_validator_1.default);
    return new DecodeTokens(params);
};
