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
exports.GetContext = void 0;
const GetContextITF_1 = require("./GetContextITF");
const GetContextITF_validator_1 = __importDefault(require("./GetContextITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const InMemoryCtxsCollection_1 = require("../../../contexts/memory/InMemoryCtxsCollection");
const NamedFields_1 = require("../../../utils/NamedFields");
const MsgKey_1 = require("../../../messageKeys/MsgKey");
class GetContext extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { msgKeyGenerator } = this.props;
            const { initialMessage, registry: { logPrefix }, } = contexts;
            const key = msgKeyGenerator ? msgKeyGenerator.get(initialMessage) : initialMessage.__msgKey__;
            this.logger.trace(`[ GetContext ] - Using the key [${key}]`, { logPrefix });
            if (key && typeof key === "string") {
                const ctx = InMemoryCtxsCollection_1.InMemoryCtxsCollection.getInstance("Default").getEntry(key);
                if (ctx) {
                    const { data } = ctx;
                    this.logger.trace(`[ GetContext ] - Context found. Copying it to finalMessage. We will delete it later`, { logPrefix });
                    Object.assign(contexts.finalMessage, data);
                    InMemoryCtxsCollection_1.InMemoryCtxsCollection.getInstance("Default").deleteEntry(key);
                }
                else {
                    this.logger.error("[ GetContext ] - Source message from context was not found. Ignoring this message", { logPrefix });
                    throw new Error(`Message context with key ${key} NOT found`);
                }
            }
            else
                throw new Error("[ GetContext ] - The required key to save message on context is not present");
        });
    }
}
exports.GetContext = GetContext;
GetContext.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetContextITF_1.fieldsNameMappigns, GetContextITF_validator_1.default);
    let msgKeyGenerator;
    const fielNameKeys = [];
    Object.keys(params).forEach((name) => {
        const param = params[name];
        if (name.substr(0, 10) === "sourceKey_")
            fielNameKeys.push(String(param));
    });
    const { keyType } = params;
    if ((!keyType && fielNameKeys.length) || (keyType && !fielNameKeys.length))
        throw new Error("Both key type and fields must be present to use the step GetContext");
    if (keyType && fielNameKeys.length)
        msgKeyGenerator = MsgKey_1.MsgKey.create(keyType, fielNameKeys);
    InMemoryCtxsCollection_1.InMemoryCtxsCollection.createInstance("Default");
    return new GetContext({ msgKeyGenerator });
};
