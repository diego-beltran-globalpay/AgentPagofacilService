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
exports.SetError = void 0;
const SetErrorITF_1 = require("./SetErrorITF");
const SetErrorITF_validator_1 = __importDefault(require("./SetErrorITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class SetError extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { ruleName } = this.props;
            this.logger.trace(`[ SetError ] - The rule to be call on handling error is [${ruleName}]`, { logPrefix });
            contexts.registry.errorRuleName = ruleName;
        });
    }
}
exports.SetError = SetError;
SetError.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SetErrorITF_1.fieldsNameMappigns, SetErrorITF_validator_1.default);
    return new SetError(params);
};
SetError.isSetError = (value) => {
    return value instanceof Object && value.props && value.props.ruleName;
};
