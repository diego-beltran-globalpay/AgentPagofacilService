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
exports.GoTo = void 0;
const GoToITF_1 = require("./GoToITF");
const GoToITF_validator_1 = __importDefault(require("./GoToITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GoTo extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { ruleName, cleanFinalMessage } = this.props;
            this.logger.trace(`[ GoTo ] - Executing the rule [${ruleName}], leaving the rest of the steps of this one. Cleaining final message?: [${cleanFinalMessage ? "YES" : "NO"}]`, {
                logPrefix,
            });
            if (cleanFinalMessage)
                contexts.finalMessage = {};
            contexts.registry.goToRuleName = ruleName;
        });
    }
}
exports.GoTo = GoTo;
GoTo.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GoToITF_1.fieldsNameMappigns, GoToITF_validator_1.default);
    return new GoTo(params);
};
