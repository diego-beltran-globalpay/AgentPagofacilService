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
exports.TruncateNumber = void 0;
const TruncateNumberITF_1 = require("./TruncateNumberITF");
const TruncateNumberITF_validator_1 = __importDefault(require("./TruncateNumberITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const Numbers_1 = require("../../../../modules/utils/types/Numbers");
const NamedFields_1 = require("../../../utils/NamedFields");
class TruncateNumber extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, decimalLength } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ TruncateNumber ] - We wil truncate to ${decimalLength} the number ${field}`, { logPrefix });
            if (typeof field === "string" || typeof field === "number")
                return Numbers_1.Numbers.truncateNumber(field, decimalLength);
            else
                this.logger.error("[ TruncateNumber ] - The source was empty or is not a valid type", { logPrefix });
        });
    }
}
exports.TruncateNumber = TruncateNumber;
TruncateNumber.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, TruncateNumberITF_1.fieldsNameMappigns, TruncateNumberITF_validator_1.default);
    return new TruncateNumber(params);
};
