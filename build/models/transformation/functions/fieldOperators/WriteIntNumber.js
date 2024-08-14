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
exports.WriteIntNumber = void 0;
const WriteIntNumberITF_1 = require("./WriteIntNumberITF");
const WriteIntNumberITF_validator_1 = __importDefault(require("./WriteIntNumberITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class WriteIntNumber extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, type, length, isSigned } = this.props;
            const field = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ WriteIntNumber ] - Field Name: ${fieldNameSource} - Value: ${field} - Type: ${type} - Length: ${length} - IsSigned: ${isSigned}`, {
                logPrefix,
            });
            const buffer = Buffer.alloc(length);
            if (!field || isNaN(field))
                return undefined;
            if (type === "BE") {
                const funcName = isSigned ? "writeIntBE" : "writeUIntBE";
                buffer[funcName](field, 0, length);
            }
            else {
                const funcName = isSigned ? "writeIntLE" : "writeUIntLE";
                buffer[funcName](field, 0, length);
            }
            return buffer.toString("hex").toUpperCase();
        });
    }
}
exports.WriteIntNumber = WriteIntNumber;
WriteIntNumber.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, WriteIntNumberITF_1.fieldsNameMappigns, WriteIntNumberITF_validator_1.default);
    return new WriteIntNumber(params);
};
