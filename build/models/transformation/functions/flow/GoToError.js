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
exports.GoToError = void 0;
const GoToErrorITF_1 = require("./GoToErrorITF");
const GoToErrorITF_validator_1 = __importDefault(require("./GoToErrorITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const AutoReplyMessage_1 = require("./AutoReplyMessage");
const NamedFields_1 = require("../../../utils/NamedFields");
class GoToError extends FunctionModel_1.FunctionModel {
    constructor() {
        super(...arguments);
        this.autoReplyStep = new AutoReplyMessage_1.AutoReplyMessage({});
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { cleanFinalMessage } = this.props;
            this.logger.trace(`[ GoToError ] - Changing direction to apply error on this rule. Cleaining final message?: [${cleanFinalMessage ? "YES" : "NO"}]`, {
                logPrefix,
            });
            if (cleanFinalMessage)
                contexts.finalMessage = {};
            this.autoReplyStep.applySave(contexts);
            contexts.registry.goToError = true;
        });
    }
}
exports.GoToError = GoToError;
GoToError.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GoToErrorITF_1.fieldsNameMappigns, GoToErrorITF_validator_1.default);
    return new GoToError(params);
};
