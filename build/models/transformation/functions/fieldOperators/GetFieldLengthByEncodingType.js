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
exports.GetFieldLengthByEncodingType = void 0;
const GetFieldLengthByEncodingTypeITF_1 = require("./GetFieldLengthByEncodingTypeITF");
const GetFieldLengthByEncodingTypeITF_validator_1 = __importDefault(require("./GetFieldLengthByEncodingTypeITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetFieldLengthByEncodingType extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, encoding } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ GetFieldLengthByEncodingType ] - Get field length from ${fieldNameSource}. Encoding: ${encoding}. Value: ${field}`, { logPrefix });
            if (field) {
                const length = field.toString().length.toString();
                switch (encoding) {
                    case "hex":
                    case "16":
                        return length.toString(16);
                    case "oct":
                    case "8":
                        return length.toString(8);
                    default:
                        return length.toString();
                }
            }
            else {
                this.logger.error(`[ GetFieldLengthByEncodingType ] - Field value is not a present`, { logPrefix });
            }
        });
    }
}
exports.GetFieldLengthByEncodingType = GetFieldLengthByEncodingType;
GetFieldLengthByEncodingType.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetFieldLengthByEncodingTypeITF_1.fieldsNameMappigns, GetFieldLengthByEncodingTypeITF_validator_1.default);
    return new GetFieldLengthByEncodingType(params);
};
