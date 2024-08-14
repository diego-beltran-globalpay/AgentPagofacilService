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
exports.ForIn = void 0;
const ForInITF_1 = require("./ForInITF");
const ForInITF_validator_1 = __importDefault(require("./ForInITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class ForIn extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, ruleName } = this.props;
            this.logger.trace(`[ ForIn ] - Looping through each element of [${fieldNameSource}] with rule [${ruleName}]`, { logPrefix });
            const sourceObj = this.accessor.static.isContextRef(fieldNameSource)
                ? yield this.accessor.static.getReference(fieldNameSource, contexts)
                : yield this.accessor.get(fieldNameSource, contexts);
            if (sourceObj && sourceObj instanceof Object) {
                contexts.registry.forIn = { ruleName, sourceObj };
            }
            else {
                this.logger.error(`[ ForIn ] - The field ${fieldNameSource} is not an object`, { logPrefix });
            }
        });
    }
}
exports.ForIn = ForIn;
ForIn.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ForInITF_1.fieldsNameMappigns, ForInITF_validator_1.default);
    return new ForIn(params);
};
