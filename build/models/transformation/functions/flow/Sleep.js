"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleep = void 0;
const SleepITF_1 = require("./SleepITF");
const SleepITF_validator_1 = __importDefault(require("./SleepITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const UnitConversor_1 = require("../../../time/UnitConversor");
class Sleep extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        const { registry: { logPrefix }, } = contexts;
        const { amount, unit } = this.props;
        this.logger.trace(`[ Sleep ] - We will sleep this for ${amount}${unit}`, { logPrefix });
        const amountMs = UnitConversor_1.UnitConversor.toMs(amount, unit);
        return new Promise(resolve => {
            setTimeout(resolve, amountMs);
        });
    }
}
exports.Sleep = Sleep;
Sleep.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SleepITF_1.fieldsNameMappigns, SleepITF_validator_1.default);
    return new Sleep(params);
};
