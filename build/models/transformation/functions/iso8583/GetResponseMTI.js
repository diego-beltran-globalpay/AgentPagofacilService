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
exports.GetResponseMTI = void 0;
const GetResponseMtiITF_1 = require("./GetResponseMtiITF");
const GetResponseMtiITF_validator_1 = __importDefault(require("./GetResponseMtiITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetResponseMTI extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource } = this.props;
            const mti = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ GetResponseMTI ] - Generation response MTI. Source: ${fieldNameSource}, Value: ${mti}`, { logPrefix });
            if (mti && typeof mti === "string") {
                return mti.substr(0, 1) + mti.substr(1, 1) + (parseInt(mti.substr(2, 1)) + 1).toString() + mti.substr(3, 1);
            }
            else {
                this.logger.error("[ GetResponseMTI ] - The MTI to use is empty or it is not a string.", { logPrefix });
            }
        });
    }
}
exports.GetResponseMTI = GetResponseMTI;
GetResponseMTI.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetResponseMtiITF_1.fieldsNameMappigns, GetResponseMtiITF_validator_1.default);
    return new GetResponseMTI(params);
};
