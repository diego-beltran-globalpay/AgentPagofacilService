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
exports.ForEach = void 0;
const ForEachITF_1 = require("./ForEachITF");
const ForEachITF_validator_1 = __importDefault(require("./ForEachITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class ForEach extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, ruleName } = this.props;
            const sourceArray = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ ForEach ] - Looping through each element of [${fieldNameSource}] with rule [${ruleName}]`, { logPrefix });
            if (sourceArray && sourceArray instanceof Array) {
                this.logger.trace(`[ ForEach ] - The array has ${sourceArray.length} elements`, { logPrefix });
                contexts.registry.forEach = { ruleName, sourceArray };
            }
            else {
                this.logger.error(`[ ForEach ] - The field ${fieldNameSource} is not an array`, { logPrefix });
            }
        });
    }
}
exports.ForEach = ForEach;
ForEach.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ForEachITF_1.fieldsNameMappigns, ForEachITF_validator_1.default);
    return new ForEach(params);
};
