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
exports.Replace = void 0;
const ReplaceITF_1 = require("./ReplaceITF");
const ReplaceITF_validator_1 = __importDefault(require("./ReplaceITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Replace extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, destFieldName, initPos } = this.props;
            let { length } = this.props;
            const sourceStr = yield this.accessor.get(fieldNameSource, contexts);
            const toReplace = yield this.accessor.get(destFieldName, contexts);
            if (!sourceStr || !toReplace) {
                this.logger.error("[ Replace ] - The main field or the field used to replace were not found", { logPrefix });
                return undefined;
            }
            else if (typeof sourceStr === "string" && typeof toReplace === "string") {
                let result = sourceStr.substring(0, initPos);
                this.logger.trace(`[ Replace ] - Replacing from ${initPos} to ${length} of the string ${sourceStr} with ${toReplace}`, {
                    logPrefix,
                });
                if (length === 0 || length === -1) {
                    result += toReplace;
                    length = toReplace.length;
                }
                else if (length > 0) {
                    result += toReplace.substring(0, length);
                    if (toReplace.length < length)
                        length = toReplace.length;
                }
                result += sourceStr.substring(initPos + length);
                return result;
            }
            else
                throw new Error("The main field or the field used to replace are not string");
        });
    }
}
exports.Replace = Replace;
Replace.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ReplaceITF_1.fieldsNameMappigns, ReplaceITF_validator_1.default);
    return new Replace(params);
};
