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
exports.IfEmpty = void 0;
const IfEmtpyITF_1 = require("./IfEmtpyITF");
const IfEmtpyITF_validator_1 = __importDefault(require("./IfEmtpyITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class IfEmpty extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, defaultVal } = this.props;
            this.logger.debug("[ IfEmpty ] - Setting value indicated if field is empty or undefined", { logPrefix });
            this.logger.trace(`[ IfEmpty ] - The funtion parameters are... fieldName: ${fieldNameSource} - defaultVal: ${defaultVal}`, {
                logPrefix,
            });
            const fieldValue = yield this.accessor.get(fieldNameSource, contexts);
            if (!fieldValue || fieldValue.trim() == "") {
                this.logger.trace(`[ IfEmpty ] - The field ${fieldNameSource} is empty or undefined. Setting default velue [${defaultVal}]`, {
                    logPrefix,
                });
                return defaultVal;
            }
            else {
                this.logger.trace(`[ IfEmpty ] - The field ${fieldNameSource} is not empty. Value: ${fieldValue}`, { logPrefix });
                return fieldValue;
            }
        });
    }
}
exports.IfEmpty = IfEmpty;
IfEmpty.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, IfEmtpyITF_1.fieldsNameMappigns, IfEmtpyITF_validator_1.default);
    return new IfEmpty(params);
};
