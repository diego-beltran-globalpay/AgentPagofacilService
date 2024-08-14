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
exports.ReplaceAll = void 0;
const ReplaceAllITF_1 = require("./ReplaceAllITF");
const ReplaceAllITF_validator_1 = __importDefault(require("./ReplaceAllITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class ReplaceAll extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, destFieldName, replaceByFieldName } = this.props;
            let value = yield this.accessor.get(fieldNameSource, contexts);
            const toReplace = yield this.accessor.get(destFieldName, contexts);
            const replaceBy = yield this.accessor.get(replaceByFieldName, contexts);
            if (!value || !toReplace) {
                this.logger.error("[ ReplaceAll ] - The main field or the field used to replace were not found", { logPrefix });
                return undefined;
            }
            else if (typeof value === "string" && typeof toReplace === "string") {
                this.logger.trace(`[ Replace ] - Replacing all occurrences of value ${toReplace} in the string ${value} with ${replaceBy}`, {
                    logPrefix,
                });
                while (value.indexOf(toReplace) > -1)
                    value = value.replace(toReplace, replaceBy);
                return value;
            }
            else
                throw new Error("The main field or the field used to replace are not string");
        });
    }
}
exports.ReplaceAll = ReplaceAll;
ReplaceAll.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ReplaceAllITF_1.fieldsNameMappigns, ReplaceAllITF_validator_1.default);
    return new ReplaceAll(params);
};
