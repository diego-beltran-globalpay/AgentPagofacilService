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
exports.GetArrayLength = void 0;
const GetArrayLengthITF_1 = require("./GetArrayLengthITF");
const GetArrayLengthITF_validator_1 = __importDefault(require("./GetArrayLengthITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetArrayLength extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, length } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ GetArrayLength ] - Get array length from ${fieldNameSource}. Value: ${field}`, { logPrefix });
            if (!(field instanceof Array))
                return undefined;
            let aux = "";
            for (let tmpCounter = 0; tmpCounter < length; tmpCounter++)
                aux += "0";
            return aux.substr(0, length - field.length.toString().length) + field.length;
        });
    }
}
exports.GetArrayLength = GetArrayLength;
GetArrayLength.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetArrayLengthITF_1.fieldsNameMappigns, GetArrayLengthITF_validator_1.default);
    return new GetArrayLength(params);
};
