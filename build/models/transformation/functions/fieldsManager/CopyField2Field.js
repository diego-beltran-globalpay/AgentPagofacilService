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
exports.CopyField2Field = void 0;
const CopyField2FieldITF_1 = require("./CopyField2FieldITF");
const CopyField2FieldITF_validator_1 = __importDefault(require("./CopyField2FieldITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class CopyField2Field extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, destFieldSource, relativeDestField } = this.props;
            const value = yield this.accessor.get(fieldNameSource, contexts);
            const dest = relativeDestField ? yield this.accessor.get(destFieldSource, contexts) : destFieldSource;
            if (dest && typeof dest === "string") {
                this.logger.trace(`[ CopyFieldToField ] - The funtion parameters are: fieldSourceName: ${fieldNameSource} - destFieldSource: ${destFieldSource}`, {
                    logPrefix,
                });
                yield this.accessor.set(dest, value, contexts);
            }
            else {
                throw new Error("The destination field name is undefined");
            }
        });
    }
}
exports.CopyField2Field = CopyField2Field;
CopyField2Field.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, CopyField2FieldITF_1.fieldsNameMappigns, CopyField2FieldITF_validator_1.default);
    return new CopyField2Field(params);
};
