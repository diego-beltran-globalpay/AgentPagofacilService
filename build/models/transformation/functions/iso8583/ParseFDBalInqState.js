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
exports.ParseFDBalInqState = void 0;
const ParseFDBalInqStateITF_1 = require("./ParseFDBalInqStateITF");
const ParseFDBalInqStateITF_validator_1 = __importDefault(require("./ParseFDBalInqStateITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const Numbers_1 = require("../../../../modules/utils/types/Numbers");
const NamedFields_1 = require("../../../utils/NamedFields");
class ParseFDBalInqState extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource } = this.props;
            const source = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ ParseFDBalInqState ] - Parsing balance inquiry state from response. Source: ${fieldNameSource}, Value: ${source}`, { logPrefix });
            let position = 0;
            if (!source || typeof source !== "string") {
                this.logger.error("[ ParseFDBalInqState ] - Balance inquiry state is not present in host response.", { logPrefix });
                return undefined;
            }
            const productName = source.substr(position, 3);
            position += 3;
            let productLength = parseInt(source.substr(position, 3));
            position += 3;
            productLength -= 3;
            if (productName !== "250") {
                this.logger.error(`[ ParseFDBalInqState ] - Product name  [${productName}] has not the expected value [250].`, { logPrefix });
                return undefined;
            }
            if (source.substr(position).length !== productLength) {
                this.logger.error(`[ ParseFDBalInqState ] - Product length sent [${source.substr(position).length}] is not the same to the received one [${productLength}].`, { logPrefix });
                return undefined;
            }
            const subProductsQty = parseInt(source.substr(position, 4));
            position += 4;
            const subProductsLength = parseInt(source.substr(position, 3));
            position += 3;
            if (subProductsQty !== 1) {
                this.logger.error(`[ ParseFDBalInqState ] - SubProducts quantity  [${subProductsQty}] has not the expected value [1].`, {
                    logPrefix,
                });
                return undefined;
            }
            if (source.substr(position).length !== subProductsLength) {
                this.logger.error(`[ ParseFDBalInqState ] - SubProducts length sent [${source.substr(position).length}] is not the same to the received one [${subProductsLength}].`, { logPrefix });
                return undefined;
            }
            let DebtAmount, MinimunPaymentAmount;
            let DueDate = source.substr(position, 8);
            position += 8;
            const AccountStatus = [];
            DebtAmount = Numbers_1.Numbers.convertFixedToFloat(source.substr(position, 12), 2);
            position += 12;
            MinimunPaymentAmount = Numbers_1.Numbers.convertFixedToFloat(source.substr(position, 12), 2);
            position += 12;
            if (!DebtAmount || !MinimunPaymentAmount)
                return undefined;
            else
                AccountStatus.push({ DebtAmount, MinimunPaymentAmount, CurrencyCode: "032" });
            DebtAmount = Numbers_1.Numbers.convertFixedToFloat(source.substr(position, 12), 2);
            position += 12;
            MinimunPaymentAmount = Numbers_1.Numbers.convertFixedToFloat(source.substr(position, 12), 2);
            position += 12;
            if (!DebtAmount || !MinimunPaymentAmount)
                return undefined;
            else
                AccountStatus.push({ DebtAmount, MinimunPaymentAmount, CurrencyCode: "032" });
            let NextClosingDate = source.substr(position, 8);
            position += 8;
            let NextDueDate = source.substr(position, 8);
            //position += 8;
            DueDate = `${DueDate.substr(4, 4)}-${DueDate.substr(2, 2)}-${DueDate.substr(0, 2)}`;
            if (NextClosingDate === "00000000") {
                NextClosingDate = undefined;
            }
            else {
                NextClosingDate = NextClosingDate.substr(4, 4) + "-" + NextClosingDate.substr(2, 2) + "-" + NextClosingDate.substr(0, 2);
            }
            if (NextDueDate === "00000000") {
                NextDueDate = undefined;
            }
            else {
                NextDueDate = NextDueDate.substr(4, 4) + "-" + NextDueDate.substr(2, 2) + "-" + NextDueDate.substr(0, 2);
            }
            return { AccountStatus, NextClosingDate, NextDueDate, DueDate };
        });
    }
}
exports.ParseFDBalInqState = ParseFDBalInqState;
ParseFDBalInqState.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ParseFDBalInqStateITF_1.fieldsNameMappigns, ParseFDBalInqStateITF_validator_1.default);
    return new ParseFDBalInqState(params);
};
