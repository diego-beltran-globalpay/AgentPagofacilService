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
exports.SetDateTimeTz = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const SetDateTimeTzITF_1 = require("./SetDateTimeTzITF");
const SetDateTimeTzITF_validator_1 = __importDefault(require("./SetDateTimeTzITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class SetDateTimeTz extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameDest, timezone } = this.props;
            const dateTime = new Date();
            const dateTimeValue = !timezone ? moment_timezone_1.default(dateTime) : moment_timezone_1.default.tz(dateTime, timezone);
            this.logger.debug(`[ SetDateTimeTz ] - Setting new Date in ${fieldNameDest} variable ${timezone ? ` with timezone ${timezone}` : ""}`, { logPrefix });
            return dateTimeValue;
        });
    }
}
exports.SetDateTimeTz = SetDateTimeTz;
SetDateTimeTz.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SetDateTimeTzITF_1.fieldsNameMappigns, SetDateTimeTzITF_validator_1.default);
    return new SetDateTimeTz(params);
};
