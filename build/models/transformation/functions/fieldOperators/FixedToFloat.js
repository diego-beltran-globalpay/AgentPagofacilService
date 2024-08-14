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
exports.FixedToFloat = void 0;
const FixedToFloatITF_1 = require("./FixedToFloatITF");
const FixedToFloatITF_validator_1 = __importDefault(require("./FixedToFloatITF.validator"));
const Numbers_1 = require("../../../../modules/utils/types/Numbers");
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class FixedToFloat extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, decimalLength } = this.props;
            this.logger.trace(`[ FixedToFloat ] - Converting fixed to float indicated. Field name: ${fieldNameSource} - Decimal length: ${decimalLength}`, {
                logPrefix,
            });
            const field = yield this.accessor.get(fieldNameSource, contexts);
            return field ? Numbers_1.Numbers.convertFixedToFloat(field, decimalLength) : undefined;
        });
    }
}
exports.FixedToFloat = FixedToFloat;
FixedToFloat.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, FixedToFloatITF_1.fieldsNameMappigns, FixedToFloatITF_validator_1.default);
    return new FixedToFloat(params);
};
