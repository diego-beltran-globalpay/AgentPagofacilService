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
exports.IndexOf = void 0;
const IndexOfITF_1 = require("./IndexOfITF");
const IndexOfITF_validator_1 = __importDefault(require("./IndexOfITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class IndexOf extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, stringToLookSource, startPosSource } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            const stringToLook = yield this.accessor.get(stringToLookSource, contexts);
            const startPos = startPosSource ? yield this.accessor.get(startPosSource, contexts) : undefined;
            this.logger.debug(`[ IndexOf ] - Looking for the position of the given string, starting from ${!isNaN(startPos) ? startPos : 0}. Source: ${fieldNameSource} - Value: ${field}`, {
                logPrefix,
            });
            if (field && typeof field === "string") {
                const position = field.indexOf(stringToLook, !isNaN(startPos) ? startPos : undefined);
                this.logger.trace(`[ IndexOf ] - The position of [${stringToLook}] in [${field}] is ${position}`, { logPrefix });
                return position;
            }
            else {
                this.logger.error(`[ IndexOf ] - The field is not a string`, { logPrefix });
            }
        });
    }
}
exports.IndexOf = IndexOf;
IndexOf.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, IndexOfITF_1.fieldsNameMappigns, IndexOfITF_validator_1.default);
    return new IndexOf(params);
};
