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
exports.Substring = void 0;
const SubstringITF_1 = require("./SubstringITF");
const SubstringITF_validator_1 = __importDefault(require("./SubstringITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Substring extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, initPositionSource, finalPositionSource, applyTrim } = this.props;
            let result;
            const value = yield this.accessor.get(fieldNameSource, contexts);
            const initPositionString = yield this.accessor.get(initPositionSource, contexts);
            const finalPositionString = yield this.accessor.get(finalPositionSource, contexts);
            const initPosition = !isNaN(initPositionString) ? parseInt(initPositionString) : 0;
            const finalPosition = !isNaN(finalPositionString) ? parseInt(finalPositionString) : 0;
            if (!value) {
                this.logger.trace("[ Substring ] - Field value is undefined. Substring not applied", { logPrefix });
                return undefined;
            }
            const valueToUse = typeof value !== "string" ? value.toString() : value;
            if (finalPosition === 0) {
                this.logger.trace(`[ Substring ] - We will get from the initial position ${initPosition}`, { logPrefix });
                result = valueToUse.substring(initPosition);
            }
            else {
                this.logger.trace(`[ Substring ] - We will get from the initial position ${initPosition} to ${finalPosition}`, { logPrefix });
                result = valueToUse.substring(initPosition, finalPosition);
            }
            result = applyTrim && result ? result.trim() : result;
            return result;
        });
    }
}
exports.Substring = Substring;
Substring.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SubstringITF_1.fieldsNameMappigns, SubstringITF_validator_1.default);
    return new Substring(params);
};
