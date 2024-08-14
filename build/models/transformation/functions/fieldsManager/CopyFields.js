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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyFields = void 0;
const FunctionModel_1 = require("../FunctionModel");
class CopyFields extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            this.logger.debug("[ CopyFields ] - Coping fields from source message into targetMessage", { logPrefix });
            if (!contexts.finalMessage)
                contexts.finalMessage = {};
            for (const fieldNum in contexts.initialMessage)
                contexts.finalMessage[fieldNum] = contexts.initialMessage[fieldNum];
        });
    }
}
exports.CopyFields = CopyFields;
CopyFields.buildFromString = (paramsToParse) => {
    const params = {};
    return new CopyFields(params);
};
