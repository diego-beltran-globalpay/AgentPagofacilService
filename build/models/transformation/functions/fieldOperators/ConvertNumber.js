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
exports.ConvertNumber = void 0;
const ConvertNumberITF_1 = require("./ConvertNumberITF");
const ConvertNumberITF_validator_1 = __importDefault(require("./ConvertNumberITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class ConvertNumber extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, baseFrom, baseTo } = this.props;
            this.logger.debug(`[ ConvertNumber ] - Converting number to another base. Source: ${fieldNameSource} - Base from ${baseFrom} - Base to ${baseTo}`, {
                logPrefix,
            });
            const field = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ ConvertNumber ] - Field value: ${field}`, { logPrefix });
            let numberConv = undefined;
            if (field && !isNaN(field)) {
                if (baseTo === 10) {
                    numberConv = parseInt(field, baseFrom).toString();
                }
                else if (baseFrom === 10) {
                    numberConv = parseInt(field).toString(baseTo);
                }
                else {
                    throw new Error("Number conversion not supported!");
                }
            }
            return numberConv;
        });
    }
}
exports.ConvertNumber = ConvertNumber;
ConvertNumber.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ConvertNumberITF_1.fieldsNameMappigns, ConvertNumberITF_validator_1.default);
    return new ConvertNumber(params);
};
