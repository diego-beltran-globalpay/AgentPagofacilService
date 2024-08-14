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
exports.Split = void 0;
const SplitITF_1 = require("./SplitITF");
const SplitITF_validator_1 = __importDefault(require("./SplitITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Split extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, splitValue, indextToReturn } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            let index = -1;
            if (indextToReturn !== undefined) {
                if (Number.isInteger(parseInt(indextToReturn))) {
                    index = parseInt(indextToReturn);
                }
                else {
                    index = yield this.accessor.get(indextToReturn, contexts);
                    if (!Number.isInteger(index))
                        throw new Error(`Index value is not a number`);
                }
            }
            this.logger.trace(`[ Split ] - Split string from ${fieldNameSource}. Value: ${field}. SplitValue: ${splitValue}. IndextToReturn: ${indextToReturn}`, {
                logPrefix,
            });
            if (field && typeof field === "string") {
                const split = field.split(splitValue);
                return index !== -1 ? split[index >= 0 ? index : split.length + index] : split;
            }
            else {
                this.logger.error(`[ Split ] - Field value is not a valid string`, { logPrefix });
            }
        });
    }
}
exports.Split = Split;
Split.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SplitITF_1.fieldsNameMappigns, SplitITF_validator_1.default);
    return new Split(params);
};
