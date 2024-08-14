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
exports.UpdateContextV2 = void 0;
const UpdateContextV2ITF_1 = require("./UpdateContextV2ITF");
const UpdateContextV2ITF_validator_1 = __importDefault(require("./UpdateContextV2ITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const CtxsCollection_1 = require("../../../contexts/CtxsCollection");
const NamedFields_1 = require("../../../utils/NamedFields");
const MsgKey_1 = require("../../../messageKeys/MsgKey");
class UpdateContextV2 extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ctxInstanceName, msgKeyGenerator, fieldNameSource } = this.props;
            const { initialMessage, registry: { logPrefix }, } = contexts;
            const key = msgKeyGenerator ? msgKeyGenerator.get(initialMessage) : initialMessage.__msgKey__;
            const data = this.accessor.static.isContextRefStrict(fieldNameSource)
                ? this.accessor.static.getReference(fieldNameSource, contexts)
                : this.accessor.static.get(fieldNameSource, contexts);
            this.logger.trace(`[ UpdateContextV2 ] - Updating context with the key [${key}]`, { logPrefix });
            if (key && typeof key === "string")
                yield CtxsCollection_1.CtxsCollection.getInstance(ctxInstanceName).updateEntry(key, data);
            else
                throw new Error("The required key to update message on context is not present");
        });
    }
}
exports.UpdateContextV2 = UpdateContextV2;
UpdateContextV2.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, UpdateContextV2ITF_1.fieldsNameMappigns, UpdateContextV2ITF_validator_1.default);
    let msgKeyGenerator;
    const fielNameKeys = [];
    Object.keys(params).forEach((name) => {
        const param = params[name];
        if (name.substr(0, 10) === "sourceKey_")
            fielNameKeys.push(String(param));
    });
    const { keyType, ctxInstanceName, fieldNameSource } = params;
    if ((!keyType && fielNameKeys.length) || (keyType && !fielNameKeys.length))
        throw new Error("Both key type and fields must be present to use the step GetContext");
    if (keyType && fielNameKeys.length)
        msgKeyGenerator = MsgKey_1.MsgKey.create(keyType, fielNameKeys);
    return new UpdateContextV2({ fieldNameSource, ctxInstanceName, msgKeyGenerator });
};
