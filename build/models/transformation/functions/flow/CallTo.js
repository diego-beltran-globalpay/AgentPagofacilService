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
exports.CallTo = void 0;
const CallToITF_1 = require("./CallToITF");
const CallToITF_validator_1 = __importDefault(require("./CallToITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class CallTo extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { ruleName, cleanFinalMessage } = this.props;
            this.logger.trace(`[ CallTo ] - Calling rule. RuleName: ${ruleName} - CleanFinalMessage: ${cleanFinalMessage}`, { logPrefix });
            if (cleanFinalMessage) {
                this.logger.trace("[ CallTo ] - The finalMessage will be cleaned", { logPrefix });
                contexts.finalMessage = {};
            }
            contexts.registry.callToRuleName = ruleName;
        });
    }
}
exports.CallTo = CallTo;
CallTo.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, CallToITF_1.fieldsNameMappigns, CallToITF_validator_1.default);
    return new CallTo(params);
};
