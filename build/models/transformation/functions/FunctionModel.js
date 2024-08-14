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
exports.FunctionModel = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const TransfCtxAccessor_1 = require("../contexts/TransfCtxAccessor");
class FunctionModel {
    constructor(props) {
        this.props = props;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.accessor = TransfCtxAccessor_1.TransfCtxAccessorInst.getInstance();
    }
    applySave(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const result = yield this.apply(contexts);
            this.logger.debug(`The result of this function is [${typeof result === "object" ? JSON.stringify(result) : result}]`, { logPrefix });
            if (result) {
                const { fieldNameSource, fieldNameDest } = this.props;
                if (fieldNameDest)
                    yield this.accessor.set(fieldNameDest, result, contexts);
                else if (fieldNameSource)
                    yield this.accessor.set(fieldNameSource, result, contexts);
                else
                    throw new Error("No field name to save the result");
            }
        });
    }
    applyReturn(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const result = yield this.apply(contexts);
            this.logger.debug(`The result of this function is [${typeof result === "object" ? JSON.stringify(result) : result}]`, { logPrefix });
            return result;
        });
    }
}
exports.FunctionModel = FunctionModel;
