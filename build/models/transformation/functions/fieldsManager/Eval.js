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
exports.Eval = void 0;
const EvalITF_1 = require("./EvalITF");
const EvalITF_validator_1 = __importDefault(require("./EvalITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Eval extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { type, fieldNameSource } = this.props;
            this.logger.debug(`[ Eval ] - Evaluating ${fieldNameSource}. Type: ${type}`, { logPrefix });
            switch (type) {
                case EvalITF_1.Types.Binary:
                    const { bitPosition = 0 } = this.props;
                    const value = yield this.accessor.get(fieldNameSource, contexts);
                    this.logger.debug(`[ Eval ] - Operand: Binary - Bit Position: ${bitPosition} - Value: [${value}"]`, { logPrefix });
                    return (parseInt(value, 16) & (2 ^ bitPosition)) === (2 ^ bitPosition);
                case EvalITF_1.Types.Relational:
                    const { operation, fieldNameAltSource = "" } = this.props;
                    const field1 = yield this.accessor.get(fieldNameSource, contexts);
                    const field2 = yield this.accessor.get(fieldNameAltSource, contexts);
                    this.logger.debug(`[ Eval ] - Operand: [${operation}] - Value 1: [${field1}"] - Value 2: [${field2}]`, { logPrefix });
                    switch (operation) {
                        case EvalITF_1.RelationalOperators.gt:
                            return field1 > field2;
                        case EvalITF_1.RelationalOperators.gte:
                            return field1 >= field2;
                        case EvalITF_1.RelationalOperators.lt:
                            return field1 < field2;
                        case EvalITF_1.RelationalOperators.lte:
                            return field1 <= field2;
                        case EvalITF_1.RelationalOperators.eq:
                            return field1 == field2;
                        case EvalITF_1.RelationalOperators.neq:
                            return field1 != field2;
                    }
            }
        });
    }
}
exports.Eval = Eval;
Eval.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, EvalITF_1.fieldsNameMappigns, EvalITF_validator_1.default);
    return new Eval(params);
};
