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
exports.Substraction = void 0;
const SubstractionITF_1 = require("./SubstractionITF");
const SubstractionITF_validator_1 = __importDefault(require("./SubstractionITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Substraction extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { valuesFieldName = [] } = this.props;
            this.logger.debug(`[ Subtraction ] - Fields source: [${valuesFieldName}]`, { logPrefix });
            const initValue = yield this.accessor.get(valuesFieldName[0], contexts);
            let result = isNaN(initValue) ? 0 : parseFloat(initValue);
            this.logger.trace(`[ Subtraction ] - The first value is : ${result}`, { logPrefix });
            for (let index = 1; index <= valuesFieldName.length; index++) {
                const num = yield this.accessor.get(valuesFieldName[index], contexts);
                result -= !isNaN(num) ? parseFloat(num) : 0;
                this.logger.trace(`[ Subtraction ] - Partial sum: ${result}`, { logPrefix });
            }
            return result;
        });
    }
}
exports.Substraction = Substraction;
Substraction.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SubstractionITF_1.fieldsNameMappigns, SubstractionITF_validator_1.default);
    const valuesFieldName = [];
    Object.keys(params).forEach((name) => {
        const param = params[name];
        if (name.substr(0, SubstractionITF_1.FIELDS_KEY_NAME.length) === SubstractionITF_1.FIELDS_KEY_NAME)
            valuesFieldName.push(String(param));
    });
    return new Substraction({ valuesFieldName });
};
