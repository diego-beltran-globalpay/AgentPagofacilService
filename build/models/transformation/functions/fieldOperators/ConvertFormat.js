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
exports.ConvertFormat = void 0;
const ConvertFormatITF_1 = require("./ConvertFormatITF");
const ConvertFormatITF_validator_1 = __importDefault(require("./ConvertFormatITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class ConvertFormat extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, srcFormat, dstFormat } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            if (field && typeof field === "string") {
                const result = Buffer.from(field, srcFormat).toString(dstFormat);
                this.logger.trace(`[ ConvertFormat ] - The field ${fieldNameSource} was converted from ${srcFormat} to ${dstFormat}. Result: ${field}`, {
                    logPrefix,
                });
                return result;
            }
            else {
                this.logger.error(`[ ConvertFormat ] - Field value is not a valid string`, { logPrefix });
            }
        });
    }
}
exports.ConvertFormat = ConvertFormat;
ConvertFormat.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ConvertFormatITF_1.fieldsNameMappigns, ConvertFormatITF_validator_1.default);
    return new ConvertFormat(params);
};
