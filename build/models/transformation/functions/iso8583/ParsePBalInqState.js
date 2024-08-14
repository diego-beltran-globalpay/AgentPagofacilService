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
exports.ParsePBalInqState = void 0;
const ParsePBalInqStateITF_1 = require("./ParsePBalInqStateITF");
const ParsePBalInqStateITF_validator_1 = __importDefault(require("./ParsePBalInqStateITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const Numbers_1 = require("../../../../modules/utils/types/Numbers");
const NamedFields_1 = require("../../../utils/NamedFields");
class ParsePBalInqState extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource } = this.props;
            const source = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ ParsePBalInqState ] - Plan V function started. Source: ${fieldNameSource}, Value: ${source}`, { logPrefix });
            if (!source || typeof source !== "string") {
                this.logger.error("[ ParsePBalInqState ] - Balance inquiry state is not present in host response.", { logPrefix });
                return undefined;
            }
            const DebtAmount = Numbers_1.Numbers.convertFixedToFloat(source.substr(34, 11), 2);
            if (!DebtAmount)
                return undefined;
            return {
                AccountStatus: [
                    {
                        DebtAmount,
                        CurrencyCode: "032",
                    },
                ],
            };
        });
    }
}
exports.ParsePBalInqState = ParsePBalInqState;
ParsePBalInqState.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ParsePBalInqStateITF_1.fieldsNameMappigns, ParsePBalInqStateITF_validator_1.default);
    return new ParsePBalInqState(params);
};
