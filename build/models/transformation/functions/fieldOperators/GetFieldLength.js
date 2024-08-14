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
exports.GetFieldLength = void 0;
const GetFieldLengthITF_1 = require("./GetFieldLengthITF");
const GetFieldLengthITF_validator_1 = __importDefault(require("./GetFieldLengthITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetFieldLength extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, length } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ GetFieldLength ] - Get field length from ${fieldNameSource}. Value: ${field}`, { logPrefix });
            if (!field || typeof field !== "string")
                return undefined;
            let aux = "";
            for (let tmpCounter = 0; tmpCounter < length; tmpCounter++)
                aux += "0";
            return aux.substr(0, length - field.length.toString().length) + field.toString().length;
        });
    }
}
exports.GetFieldLength = GetFieldLength;
GetFieldLength.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetFieldLengthITF_1.fieldsNameMappigns, GetFieldLengthITF_validator_1.default);
    return new GetFieldLength(params);
};
