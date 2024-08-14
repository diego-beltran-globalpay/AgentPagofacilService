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
exports.PushToArray = void 0;
const PushToArrayITF_1 = require("./PushToArrayITF");
const PushToArrayITF_validator_1 = __importDefault(require("./PushToArrayITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class PushToArray extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, elementToPush } = this.props;
            const array = this.accessor.get(fieldNameSource, contexts);
            const element = this.accessor.get(elementToPush, contexts);
            if (array instanceof Array) {
                array.push(element);
                this.logger.trace(`[ PushToArray ] - Pushing a new element to the array. New length: ${array.length}`, { logPrefix });
            }
            else {
                this.logger.error(`[ PushToArray ] - The source field is not an array`, { logPrefix });
            }
        });
    }
}
exports.PushToArray = PushToArray;
PushToArray.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, PushToArrayITF_1.fieldsNameMappigns, PushToArrayITF_validator_1.default);
    return new PushToArray(params);
};
