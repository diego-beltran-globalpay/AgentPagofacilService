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
exports.Substr = void 0;
const SubstrITF_1 = require("./SubstrITF");
const SubstrITF_validator_1 = __importDefault(require("./SubstrITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Substr extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, applyTrim = false, initPosition = "0", lengthFieldName = "0" } = this.props;
            let result;
            const value = yield this.accessor.get(fieldNameSource, contexts);
            const initialPosition = yield this.accessor.get(initPosition, contexts);
            const length = yield this.accessor.get(lengthFieldName, contexts);
            if (!value) {
                this.logger.trace("[ Substr ] - Field value is undefined. Substr not applied", { logPrefix });
                return undefined;
            }
            const valueToUse = String(value);
            const initPos = !initialPosition ? 0 : parseInt(initialPosition);
            if (!isNaN(length)) {
                this.logger.trace(`[ Substr ] - We will get the Substr from the initial position ${initPos} and length ${length}`, {
                    logPrefix,
                });
                result = valueToUse.substr(initPos, length);
            }
            else {
                this.logger.trace(`[ Substr ] - We will get the rest of the string from the initial position ${initPos}`, {
                    logPrefix,
                });
                result = valueToUse.substr(initPos);
            }
            if (applyTrim && result)
                result = result.trim();
            return result;
        });
    }
}
exports.Substr = Substr;
Substr.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SubstrITF_1.fieldsNameMappigns, SubstrITF_validator_1.default);
    return new Substr(params);
};
