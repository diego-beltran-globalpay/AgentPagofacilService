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
exports.FinishRule = void 0;
const FinishRuleITF_1 = require("./FinishRuleITF");
const FinishRuleITF_validator_1 = __importDefault(require("./FinishRuleITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class FinishRule extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { cleanFinalMessage } = this.props;
            this.logger.trace(`[ FinishRule ] - Stopping execution of the rest of steps in this rule. Cleaining final message?: [${cleanFinalMessage ? "YES" : "NO"}]`, { logPrefix });
            if (cleanFinalMessage) {
                this.logger.trace("[ FinishRule ] - The finalMessage will be cleaned", { logPrefix });
                contexts.finalMessage = {};
            }
            contexts.registry.finishRule = true;
        });
    }
}
exports.FinishRule = FinishRule;
FinishRule.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, FinishRuleITF_1.fieldsNameMappigns, FinishRuleITF_validator_1.default);
    return new FinishRule(params);
};
