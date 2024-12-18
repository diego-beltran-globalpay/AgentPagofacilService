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
exports.Convert2SingleLevel = void 0;
const Convert2SingleLevelITF_1 = require("./Convert2SingleLevelITF");
const Convert2SingleLevelITF_validator_1 = __importDefault(require("./Convert2SingleLevelITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const LevelConversion_1 = require("../../../../modules/levelConversion/LevelConversion");
const NamedFields_1 = require("../../../utils/NamedFields");
class Convert2SingleLevel extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            this.logger.debug("[ Convert2SingleLevel ] - Converting to single level object", { logPrefix });
            const { fieldNameSource, fieldNameDest } = this.props;
            const sourceObj = this.accessor.static.isContextRef(fieldNameSource)
                ? yield this.accessor.static.getReference(fieldNameSource, contexts)
                : yield this.accessor.get(fieldNameSource, contexts);
            if (sourceObj && sourceObj instanceof Object) {
                const result = LevelConversion_1.LevelConversion.innerConvertToSingleLevel(sourceObj);
                if (this.accessor.static.isContextRef(fieldNameDest))
                    this.accessor.static.replaceCtxValue(fieldNameDest, contexts, result);
                else
                    return result;
            }
            else {
                this.logger.error(`[ Convert2SingleLevel ] - The field ${fieldNameSource} is not an object`, { logPrefix });
            }
        });
    }
}
exports.Convert2SingleLevel = Convert2SingleLevel;
Convert2SingleLevel.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, Convert2SingleLevelITF_1.fieldsNameMappigns, Convert2SingleLevelITF_validator_1.default);
    return new Convert2SingleLevel(params);
};
