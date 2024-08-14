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
exports.FormatDate = void 0;
const dateformat_1 = __importDefault(require("dateformat"));
const FormatDateITF_1 = require("./FormatDateITF");
const FormatDateITF_validator_1 = __importDefault(require("./FormatDateITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class FormatDate extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, formatPattern } = this.props;
            this.logger.trace(`[ FormatDate ] - Format date from ${fieldNameSource}`, { logPrefix });
            const tmp = yield this.accessor.get(fieldNameSource, contexts);
            const result = dateformat_1.default(tmp, formatPattern);
            return result;
        });
    }
}
exports.FormatDate = FormatDate;
FormatDate.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, FormatDateITF_1.fieldsNameMappigns, FormatDateITF_validator_1.default);
    return new FormatDate(params);
};
