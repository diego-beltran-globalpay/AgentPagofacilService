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
exports.GetTime = void 0;
const GetTimeITF_1 = require("./GetTimeITF");
const GetTimeITF_validator_1 = __importDefault(require("./GetTimeITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetTime extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource } = this.props;
            this.logger.trace(`[ GetTime ] - Get time from ${fieldNameSource}`, { logPrefix });
            if (fieldNameSource) {
                const tmp = yield this.accessor.get(fieldNameSource, contexts);
                const variableDate = tmp instanceof Date ? tmp : new Date(tmp);
                const result = variableDate.getTime();
                this.logger.trace(`[ GetTime ] - Value: ${result}`, { logPrefix });
                return result;
            }
            else {
                throw new Error("Source field name is not present");
            }
        });
    }
}
exports.GetTime = GetTime;
GetTime.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetTimeITF_1.fieldsNameMappigns, GetTimeITF_validator_1.default);
    return new GetTime(params);
};
