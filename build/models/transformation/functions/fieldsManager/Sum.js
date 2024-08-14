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
exports.Sum = void 0;
const SumITF_1 = require("./SumITF");
const SumITF_validator_1 = __importDefault(require("./SumITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Sum extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { valuesFieldName = [] } = this.props;
            this.logger.debug(`[ Sum ] - Fields source: [${valuesFieldName}]`, { logPrefix });
            let result = 0;
            for (const index in valuesFieldName) {
                const numFieldName = valuesFieldName[index];
                const num = yield this.accessor.get(numFieldName, contexts);
                result += !isNaN(num) ? parseFloat(num) : 0;
                this.logger.trace(`[ Sum ] - Partial sum: ${result}`, { logPrefix });
            }
            return result;
        });
    }
}
exports.Sum = Sum;
Sum.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SumITF_1.fieldsNameMappigns, SumITF_validator_1.default);
    const valuesFieldName = [];
    Object.keys(params).forEach((name) => {
        const param = params[name];
        if (name.substr(0, SumITF_1.FIELDS_KEY_NAME.length) === SumITF_1.FIELDS_KEY_NAME)
            valuesFieldName.push(String(param));
    });
    return new Sum({ valuesFieldName });
};
