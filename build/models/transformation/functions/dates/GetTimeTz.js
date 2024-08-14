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
exports.GetTimeTz = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const GetTimeTzITF_1 = require("./GetTimeTzITF");
const GetTimeTzITF_validator_1 = __importDefault(require("./GetTimeTzITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetTimeTz extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, timezone } = this.props;
            this.logger.trace(`[ GetTimeTz ] - Get time with timezone from ${fieldNameSource}`, { logPrefix });
            if (fieldNameSource) {
                const tmp = yield this.accessor.get(fieldNameSource, contexts);
                const variableDate = moment_timezone_1.default.isMoment(tmp) ? tmp : moment_timezone_1.default(tmp);
                const copyVariableDate = moment_timezone_1.default(variableDate);
                let result;
                if (!timezone)
                    result = variableDate.valueOf();
                else
                    result = variableDate.tz(timezone).valueOf();
                if (this.accessor.isContextRef(fieldNameSource) && moment_timezone_1.default.isMoment(tmp))
                    yield this.accessor.set(fieldNameSource, copyVariableDate, contexts);
                this.logger.trace(`[ GetTimeTz ] - Value: ${result}`, { logPrefix });
                return result;
            }
            else {
                throw new Error("Source field name is not present");
            }
        });
    }
}
exports.GetTimeTz = GetTimeTz;
GetTimeTz.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetTimeTzITF_1.fieldsNameMappigns, GetTimeTzITF_validator_1.default);
    return new GetTimeTz(params);
};
