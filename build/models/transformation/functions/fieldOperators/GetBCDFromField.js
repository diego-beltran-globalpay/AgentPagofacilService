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
exports.GetBCDFromField = void 0;
const GetBCDFromFieldITF_1 = require("./GetBCDFromFieldITF");
const GetBCDFromFieldITF_validator_1 = __importDefault(require("./GetBCDFromFieldITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetBCDFromField extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, type } = this.props;
            const fieldToConvert = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ GetBCDFromField ] - Source from ${fieldNameSource} - Value: ${fieldToConvert}`, { logPrefix });
            if (fieldToConvert && typeof fieldToConvert === "string") {
                let result = "";
                for (let i = 0; i < fieldToConvert.length; i++) {
                    const binary = fieldToConvert[i].charCodeAt(0).toString(2);
                    const bcd1 = parseInt(binary.substr(0, 4), 2).toString(16);
                    const bcd2 = parseInt(binary.substr(4), 2).toString(16);
                    result += type == "Bigendian" ? bcd1 + bcd2 : bcd2 + bcd1;
                }
                return result;
            }
            else {
                this.logger.error("[ GetBCDFromField ] - The field is not valid", { logPrefix });
            }
        });
    }
}
exports.GetBCDFromField = GetBCDFromField;
GetBCDFromField.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetBCDFromFieldITF_1.fieldsNameMappigns, GetBCDFromFieldITF_validator_1.default);
    return new GetBCDFromField(params);
};
