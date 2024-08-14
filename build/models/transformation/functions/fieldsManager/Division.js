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
exports.Division = void 0;
const DivisionITF_1 = require("./DivisionITF");
const DivisionITF_validator_1 = __importDefault(require("./DivisionITF.validator"));
const Numbers_1 = require("../../../../modules/utils/types/Numbers");
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Division extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, fieldName2Source, resultType } = this.props;
            const source1 = yield this.accessor.get(fieldNameSource, contexts);
            const source2 = yield this.accessor.get(fieldName2Source, contexts);
            this.logger.debug(`[ Division ] - Taking data from ${fieldNameSource} and ${fieldName2Source} to divide them. Value1: ${source1}. Value2: ${source2} `, { logPrefix });
            if (isNaN(source1) || isNaN(source2))
                throw new Error("Some of the values are not a number");
            const num1 = parseFloat(source1);
            const num2 = parseFloat(source2);
            const result = Numbers_1.Numbers.division(num1, num2, resultType);
            return result;
        });
    }
}
exports.Division = Division;
Division.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, DivisionITF_1.fieldsNameMappigns, DivisionITF_validator_1.default);
    return new Division(params);
};
