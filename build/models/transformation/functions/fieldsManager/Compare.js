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
exports.Compare = void 0;
const CompareITF_1 = require("./CompareITF");
const CompareITF_validator_1 = __importDefault(require("./CompareITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const ComparisonOperator_1 = require("../../../operators/comparisonOperators/ComparisonOperator");
class Compare extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            let { operand } = this.props;
            const { fieldNameSource, fieldToCompareNameSource, stringOperand } = this.props;
            if (!operand)
                operand = ComparisonOperator_1.ComparisonOperator.fromString(stringOperand);
            this.logger.trace(`[ Compare ] - Checking [${fieldNameSource}] and [${fieldToCompareNameSource}] with the operand [${stringOperand}]`, {
                logPrefix,
            });
            const value1 = this.accessor.get(fieldNameSource, contexts);
            const value2 = this.accessor.get(fieldToCompareNameSource, contexts);
            return operand.compare(value1, value2, { logPrefix });
        });
    }
}
exports.Compare = Compare;
Compare.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, CompareITF_1.fieldsNameMappigns, CompareITF_validator_1.default);
    params.operand = ComparisonOperator_1.ComparisonOperator.fromString(params.stringOperand);
    return new Compare(params);
};
