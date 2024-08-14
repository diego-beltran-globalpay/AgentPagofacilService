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
exports.Concat = void 0;
const ConcatITF_1 = require("./ConcatITF");
const ConcatITF_validator_1 = __importDefault(require("./ConcatITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Concat extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { valuesFieldName = [] } = this.props;
            this.logger.debug(`[ Concat ] - Fields source: [${valuesFieldName}]`, { logPrefix });
            let result = "";
            for (const index in valuesFieldName) {
                const fieldName = valuesFieldName[index];
                const value = yield this.accessor.get(fieldName, contexts);
                result += value !== undefined ? value : "";
                this.logger.trace(`[ Concat ] - Partial concat: ${result}`, { logPrefix });
            }
            return result;
        });
    }
}
exports.Concat = Concat;
Concat.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ConcatITF_1.fieldsNameMappigns, ConcatITF_validator_1.default);
    const valuesFieldName = [];
    Object.keys(params).forEach((name) => {
        const param = params[name];
        if (name.substr(0, ConcatITF_1.FIELDS_KEY_NAME.length) === ConcatITF_1.FIELDS_KEY_NAME)
            valuesFieldName.push(String(param));
    });
    return new Concat({ valuesFieldName });
};
