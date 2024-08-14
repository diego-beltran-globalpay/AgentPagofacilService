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
exports.SplitHex = void 0;
const SplitHexITF_1 = require("./SplitHexITF");
const SplitHexITF_validator_1 = __importDefault(require("./SplitHexITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class SplitHex extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, splitValue, indextToReturn } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ Split ] - Split string from ${fieldNameSource}. Value: ${field}. SplitValue: ${splitValue}. IndextToReturn: ${indextToReturn}`, {
                logPrefix,
            });
            if (field && typeof field === "string") {
                const split = [];
                let temp = "";
                for (let i = 0; i < field.length;) {
                    const toCompare = `${field[i]}${field[i + 1]}`;
                    if (toCompare === splitValue) {
                        split.push(temp);
                        temp = "";
                    }
                    else
                        temp += toCompare;
                    i += 2;
                }
                if (temp != "")
                    split.push(temp);
                return indextToReturn !== undefined ? split[indextToReturn >= 0 ? indextToReturn : split.length + indextToReturn] : split;
            }
            else {
                this.logger.error(`[ GetDate ] - Field value is not a valid string`, { logPrefix });
            }
        });
    }
}
exports.SplitHex = SplitHex;
SplitHex.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SplitHexITF_1.fieldsNameMappigns, SplitHexITF_validator_1.default);
    return new SplitHex(params);
};
