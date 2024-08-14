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
exports.KVPSetElements = void 0;
const KVPSetElementsITF_1 = require("./KVPSetElementsITF");
const KVPSetElementsITF_validator_1 = __importDefault(require("./KVPSetElementsITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class KVPSetElements extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { sourceFieldNames = [], keySplitterChar, valueSplitterChar, isStartSplitterPresent, isEndSplitterPresent } = this.props;
            this.logger.debug("[ KVPSetElements ] - Setting KVP field with different values", { logPrefix });
            this.logger.debug(`[ KVPGetElement ] - Source: [${sourceFieldNames}] - KvSeparator: ${keySplitterChar} - ElementsSeparator: ${valueSplitterChar} - IsStartSplitterPresent: ${isStartSplitterPresent} - IsEndSplitterPresent: ${isEndSplitterPresent}`, {
                logPrefix,
            });
            let messageEncoded = "";
            if (isStartSplitterPresent)
                messageEncoded += keySplitterChar;
            for (const fieldName in sourceFieldNames) {
                const sourceFieldName = sourceFieldNames[fieldName];
                const fieldValue = yield this.accessor.get(sourceFieldName, contexts);
                if (fieldValue)
                    messageEncoded += sourceFieldName.substr(2) + valueSplitterChar + fieldValue + keySplitterChar;
            }
            if (isEndSplitterPresent)
                messageEncoded = messageEncoded.substr(0, messageEncoded.length - 1);
            return messageEncoded;
        });
    }
}
exports.KVPSetElements = KVPSetElements;
KVPSetElements.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, KVPSetElementsITF_1.fieldsNameMappigns, KVPSetElementsITF_validator_1.default);
    const sourceFieldNames = [];
    Object.keys(params).forEach((name) => {
        const param = params[name];
        if (name.substr(0, KVPSetElementsITF_1.FIELDS_KEY_NAME.length) === KVPSetElementsITF_1.FIELDS_KEY_NAME)
            sourceFieldNames.push(String(param));
    });
    return new KVPSetElements(Object.assign(Object.assign({}, params), { sourceFieldNames }));
};
