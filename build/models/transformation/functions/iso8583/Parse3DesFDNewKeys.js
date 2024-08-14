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
exports.Parse3DesFDNewKeys = void 0;
const Parse3DesFDNewKeysITF_1 = require("./Parse3DesFDNewKeysITF");
const Parse3DesFDNewKeysITF_validator_1 = __importDefault(require("./Parse3DesFDNewKeysITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const WkLengthsRelation = {
    "16": "S",
    "32": "D",
    "48": "T",
};
const WkTypesRelation = {
    "37": "Data",
    "74": "PIN",
};
class Parse3DesFDNewKeys extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource } = this.props;
            const source = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ Parse3DesFDNewKeys ] - Parsing new keys from response. Source: ${fieldNameSource}, Value: ${source}`, {
                logPrefix,
            });
            const workingKeys = [];
            let position = 0;
            if (!source || typeof source !== "string") {
                this.logger.error("[ Parse3DesFDNewKeys ] - New working keys response not present in host response.", { logPrefix });
                return undefined;
            }
            const productCodeAux = source.substr(position, 6);
            position += 6;
            const subFieldsQtyAux = source.substr(position, 8);
            position += 8;
            const productCode = parseInt(Buffer.from(productCodeAux, "hex").toString());
            const subFieldsQty = parseInt(Buffer.from(subFieldsQtyAux, "hex").toString());
            if (productCode !== 15) {
                this.logger.error(`[ Parse3DesFDNewKeys ] - The product code received [${productCode}] is not equal to the one we expected [015].`, { logPrefix });
                return undefined;
            }
            this.logger.debug(`[ Parse3DesFDNewKeys ] - Product Code: ${productCode} - Sub fields qty: ${subFieldsQty}`, { logPrefix });
            for (let num = 0; num < subFieldsQty;) {
                const subFieldLengthAux = source.substr(position, 6);
                position += 6;
                const subFieldLength = parseInt(Buffer.from(subFieldLengthAux, "hex").toString());
                const subFieldNameAux = source.substr(position, 6);
                position += 6;
                const subFieldName = parseInt(Buffer.from(subFieldNameAux, "hex").toString());
                const WorkingKey = source.substr(position, subFieldLength * 2);
                position += subFieldLength * 2;
                const wkLength = (subFieldLength * 2).toString();
                const wkType = subFieldName.toString();
                const isValid = Object.values(WkLengthsRelation).includes(wkLength) && Object.values(WkTypesRelation).includes(wkType) && WorkingKey;
                if (isValid) {
                    const WorkingKeyType = WkTypesRelation[wkType];
                    const WorkingKeyLength = WkLengthsRelation[wkLength];
                    const ControlData = "9999";
                    workingKeys.push({ WorkingKey, WorkingKeyType, WorkingKeyLength, ControlData });
                }
                else {
                    this.logger.error(`[ Parse3DesFDNewKeys ] - This key is not valid`, { logPrefix });
                }
                num++;
            }
            if (workingKeys.length)
                return workingKeys;
        });
    }
}
exports.Parse3DesFDNewKeys = Parse3DesFDNewKeys;
Parse3DesFDNewKeys.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, Parse3DesFDNewKeysITF_1.fieldsNameMappigns, Parse3DesFDNewKeysITF_validator_1.default);
    return new Parse3DesFDNewKeys(params);
};
