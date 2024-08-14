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
exports.FloatToFixed = void 0;
const FloatToFixedITF_1 = require("./FloatToFixedITF");
const FloatToFixedITF_validator_1 = __importDefault(require("./FloatToFixedITF.validator"));
const Numbers_1 = require("../../../../modules/utils/types/Numbers");
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class FloatToFixed extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, totalLength, decimalLength } = this.props;
            this.logger.trace(`[ FloatToFixed ] - Converting float to fixed indicated. Field name: ${fieldNameSource} - Total length: ${totalLength} - Decimal length: ${decimalLength}`, {
                logPrefix,
            });
            const field = yield this.accessor.get(fieldNameSource, contexts);
            return field ? Numbers_1.Numbers.convertFloatToFixed(field, totalLength, decimalLength) : undefined;
        });
    }
}
exports.FloatToFixed = FloatToFixed;
FloatToFixed.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, FloatToFixedITF_1.fieldsNameMappigns, FloatToFixedITF_validator_1.default);
    return new FloatToFixed(params);
};
