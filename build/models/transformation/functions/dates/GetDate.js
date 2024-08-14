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
exports.GetDate = void 0;
const GetDateITF_1 = require("./GetDateITF");
const GetDateITF_validator_1 = __importDefault(require("./GetDateITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetDate extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, yearLength } = this.props;
            this.logger.trace(`[ GetDate ] - Get date from ${fieldNameSource}`, { logPrefix });
            const date = yield this.accessor.get(fieldNameSource, contexts);
            const now = new Date();
            let result;
            this.logger.trace(`[ GetDate ] - Date value ${fieldNameSource}`, { logPrefix });
            if (date && typeof date === "string") {
                const month = parseInt(date.substr(0, 2));
                const days = parseInt(date.substr(2, 2));
                this.logger.trace(`[ GetDate ] - Split Date in month and days. Month: ${month}. Days: ${days}`, { logPrefix });
                let year = now.getFullYear().toString();
                if (yearLength == 2) {
                    year = year.toString().substr(2, 2);
                }
                this.logger.trace(`[ GetDate ] - Present year ${year}`, { logPrefix });
                if (now.getMonth() == 1 && month == 12)
                    result = (parseInt(year) - 1).toString() + date;
                else if (now.getMonth() == 12 && month == 1)
                    result = (parseInt(year) + 1).toString() + date;
                else
                    result = year + date;
                return result;
            }
            else {
                this.logger.error(`[ GetDate ] - Date value is not a valid string`, { logPrefix });
            }
        });
    }
}
exports.GetDate = GetDate;
GetDate.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetDateITF_1.fieldsNameMappigns, GetDateITF_validator_1.default);
    return new GetDate(params);
};
