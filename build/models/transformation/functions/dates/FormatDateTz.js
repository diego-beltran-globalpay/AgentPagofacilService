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
exports.FormatDateTz = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const FormatDateTzITF_1 = require("./FormatDateTzITF");
const FormatDateTzITF_validator_1 = __importDefault(require("./FormatDateTzITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class FormatDateTz extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, formatPattern, timezone } = this.props;
            this.logger.trace(`[ FormatDateTz ] - Format date from ${fieldNameSource}`, { logPrefix });
            let result;
            const tmp = yield this.accessor.get(fieldNameSource, contexts);
            const variableDate = moment_timezone_1.default.isMoment(tmp) ? tmp : moment_timezone_1.default(tmp);
            const copyVariableDate = moment_timezone_1.default(variableDate);
            if (!timezone)
                result = variableDate.format(formatPattern);
            else
                result = variableDate.tz(timezone).format(formatPattern);
            if (this.accessor.isContextRef(fieldNameSource) && moment_timezone_1.default.isMoment(tmp)) {
                yield this.accessor.set(fieldNameSource, copyVariableDate, contexts);
            }
            return result;
        });
    }
}
exports.FormatDateTz = FormatDateTz;
FormatDateTz.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, FormatDateTzITF_1.fieldsNameMappigns, FormatDateTzITF_validator_1.default);
    return new FormatDateTz(params);
};
