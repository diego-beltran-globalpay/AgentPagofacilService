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
exports.Padding = void 0;
const PaddingITF_1 = require("./PaddingITF");
const PaddingITF_validator_1 = __importDefault(require("./PaddingITF.validator"));
const Strings_1 = require("../../../../modules/utils/types/Strings");
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Padding extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, paddingChar, paddingLength, leftOrRight } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ Padding ] - Padding string... FieldName: ${fieldNameSource} - Value: ${field} - TotalLength: ${paddingChar} - DecimalLength: ${paddingLength} - DecimalLength: ${leftOrRight}`, { logPrefix });
            return field ? Strings_1.Strings.paddField(field, paddingChar, paddingLength, leftOrRight) : undefined;
        });
    }
}
exports.Padding = Padding;
Padding.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, PaddingITF_1.fieldsNameMappigns, PaddingITF_validator_1.default);
    return new Padding(params);
};
