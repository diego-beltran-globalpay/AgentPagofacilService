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
exports.GetEBCDICFromField = void 0;
const GetEBCDICFromFieldITF_1 = require("./GetEBCDICFromFieldITF");
const GetEBCDICFromFieldITF_validator_1 = __importDefault(require("./GetEBCDICFromFieldITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const ebcdic_1 = require("../../../utils/ebcdic");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetEBCDICFromField extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ GetEBCDICFromField ] - Source from ${fieldNameSource} - Value: ${field}`, { logPrefix });
            if (field && typeof field === "string") {
                let result = "";
                for (let i = 0; i < field.length; i++) {
                    const stringValue = field[i];
                    const ebcdicValue = ebcdic_1.ebcdic.Convertions[stringValue];
                    if (!ebcdicValue) {
                        this.logger.error(`[ GetEBCDICFromField ] - Character ${stringValue} not found in convertion table.`, { logPrefix });
                        return;
                    }
                    result += ebcdicValue;
                }
                return result;
            }
            else {
                this.logger.error(`[ GetEBCDICFromField ] - Field value is not a valid string`, { logPrefix });
            }
        });
    }
}
exports.GetEBCDICFromField = GetEBCDICFromField;
GetEBCDICFromField.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetEBCDICFromFieldITF_1.fieldsNameMappigns, GetEBCDICFromFieldITF_validator_1.default);
    return new GetEBCDICFromField(params);
};
