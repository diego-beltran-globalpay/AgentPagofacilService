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
exports.For = void 0;
const ForITF_1 = require("./ForITF");
const ForITF_validator_1 = __importDefault(require("./ForITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class For extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { maxValueFieldSource, initValueFieldSource, ruleName } = this.props;
            this.logger.trace(`[ For ] - The funtion parameters are: InitValueFieldSource: ${initValueFieldSource} - MaxValueFieldSource: ${maxValueFieldSource}`, {
                logPrefix,
            });
            const initValue = typeof initValueFieldSource === "string" ? yield this.accessor.get(initValueFieldSource, contexts) : initValueFieldSource;
            const maxValue = typeof maxValueFieldSource === "string" ? yield this.accessor.get(maxValueFieldSource, contexts) : maxValueFieldSource;
            this.logger.trace(`[ For ] - The values are: initValue: ${initValue} - maxValue: ${maxValue}`, {
                logPrefix,
            });
            if (typeof initValue === "number" && typeof maxValue === "number") {
                contexts.registry.for = { ruleName, initValue, maxValue };
            }
            else {
                this.logger.error(`[ For ] - The initValue [${initValue}] or maxValue [${maxValue}] are not a number`, { logPrefix });
            }
        });
    }
}
exports.For = For;
For.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ForITF_1.fieldsNameMappigns, ForITF_validator_1.default);
    return new For(params);
};
