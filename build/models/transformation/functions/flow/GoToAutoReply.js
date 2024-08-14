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
exports.GoToAutoReply = void 0;
const GoToAutoReplyITF_1 = require("./GoToAutoReplyITF");
const GoToAutoReplyITF_validator_1 = __importDefault(require("./GoToAutoReplyITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const AutoReplyMessage_1 = require("./AutoReplyMessage");
const NamedFields_1 = require("../../../utils/NamedFields");
class GoToAutoReply extends FunctionModel_1.FunctionModel {
    constructor() {
        super(...arguments);
        this.autoReplyStep = new AutoReplyMessage_1.AutoReplyMessage({});
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { cleanFinalMessage } = this.props;
            this.logger.trace(`[ GoToAutoReply ] - Changing direction to auto reply on this rule. Cleaining final message?: [${cleanFinalMessage ? "YES" : "NO"}]`, { logPrefix });
            if (cleanFinalMessage)
                contexts.finalMessage = {};
            this.autoReplyStep.applySave(contexts);
            contexts.registry.goToAutoReply = true;
        });
    }
}
exports.GoToAutoReply = GoToAutoReply;
GoToAutoReply.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GoToAutoReplyITF_1.fieldsNameMappigns, GoToAutoReplyITF_validator_1.default);
    return new GoToAutoReply(params);
};
