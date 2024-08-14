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
exports.KVPGetElements = void 0;
const KVPGetElementsITF_1 = require("./KVPGetElementsITF");
const KVPGetElementsITF_validator_1 = __importDefault(require("./KVPGetElementsITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class KVPGetElements extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, keyToFind, kvSeparator, elementsSeparator } = this.props;
            this.logger.debug("[ KVPGetElement ] - Looking for the value required using the key indicated.", { logPrefix });
            this.logger.debug(`[ KVPGetElement ] - Source: ${fieldNameSource} - KeyToFind: ${keyToFind} - KvSeparator: ${kvSeparator} - ElementsSeparator: ${elementsSeparator}`, { logPrefix });
            const stringToUse = yield this.accessor.get(fieldNameSource, contexts);
            if (stringToUse && typeof stringToUse === "string") {
                const keyPosition = stringToUse.indexOf(keyToFind);
                if (keyPosition > 0) {
                    this.logger.warn("[ KVPGetElement ] - The string was not found inside the source indicated.", { logPrefix });
                    const elementsSeparatorPos = stringToUse.indexOf(elementsSeparator, keyPosition);
                    const keyValueString = stringToUse.substring(keyPosition, elementsSeparatorPos);
                    const [key, value] = keyValueString.split(kvSeparator);
                    return value;
                }
                else {
                    this.logger.error("[ KVPGetElement ] - The string was not found inside the source indicated.", { logPrefix });
                }
            }
            else {
                this.logger.error("[ KVPGetElement ] - The source to use is empty.", { logPrefix });
            }
        });
    }
}
exports.KVPGetElements = KVPGetElements;
KVPGetElements.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, KVPGetElementsITF_1.fieldsNameMappigns, KVPGetElementsITF_validator_1.default);
    return new KVPGetElements(params);
};
