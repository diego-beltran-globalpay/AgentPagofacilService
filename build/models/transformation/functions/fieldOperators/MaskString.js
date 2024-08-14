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
exports.MaskString = void 0;
const MaskStringITF_1 = require("./MaskStringITF");
const MaskStringITF_validator_1 = __importDefault(require("./MaskStringITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class MaskString extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, mode } = this.props;
            let result = undefined;
            const string = yield this.accessor.get(fieldNameSource, contexts);
            // Si el campo a recortar es un undefined, no podemos continuar
            if (!string || typeof string !== "string") {
                this.logger.error("[ MaskString ] - Field value is not valid. MaskString not applied", { logPrefix });
                return undefined;
            }
            if (mode === "M") {
                const { freeInitChars = 0, freeEndChars = 0, maskChar } = this.props;
                this.logger.trace(`[ MaskString ] - We will mask the string. Free chars from the beginning: ${freeInitChars}. Free chars from the end: ${freeEndChars}. - MaskChar ${maskChar}`, { logPrefix });
                result = string.substr(0, freeInitChars);
                for (let i = 0; i < string.length - freeInitChars - freeEndChars; i++)
                    result += maskChar;
                result += string.substr(string.length - freeEndChars);
            }
            else {
                let { length = 0, maskChar } = this.props;
                const { initPos = 0 } = this.props;
                if (length === 0)
                    length = string.length;
                if (maskChar === "" || maskChar === undefined)
                    maskChar = "*";
                this.logger.trace(`[ MaskString ] - We will mask the string. InitialPosition: ${initPos} - Length ${length} - MaskChar ${maskChar}`, { logPrefix });
                if (initPos < 0) {
                    result = string.substr(0, string.length + initPos);
                    for (let i = 0; i > initPos; i--)
                        result += maskChar;
                }
                else {
                    result = string.substr(0, initPos);
                    for (let i = 0; i < length; i++)
                        result += maskChar;
                    result += string.substr(initPos + length);
                }
            }
            return result;
        });
    }
}
exports.MaskString = MaskString;
MaskString.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, MaskStringITF_1.fieldsNameMappigns, MaskStringITF_validator_1.default);
    return new MaskString(params);
};
