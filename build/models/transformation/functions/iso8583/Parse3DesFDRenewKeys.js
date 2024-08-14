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
exports.Parse3DesFDRenewKeys = void 0;
const Parse3DesFDRenewKeysITF_1 = require("./Parse3DesFDRenewKeysITF");
const Parse3DesFDRenewKeysITF_validator_1 = __importDefault(require("./Parse3DesFDRenewKeysITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const WkLengthsRelation = {
    "1": "S",
    "2": "D",
    "3": "T",
};
const WkTypesRelation = {
    "1": "Data",
    "2": "PIN",
};
class Parse3DesFDRenewKeys extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource } = this.props;
            const source = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ Parse3DesFDRenewKeys ] - Parsing new keys from response. Source: ${fieldNameSource}, Value: ${source}`, {
                logPrefix,
            });
            const workingKeys = [];
            let position = 0;
            if (source && typeof source === "string") {
                const wkLength = Buffer.from(source.substr(position, 2), "hex").toString();
                position += 2;
                while (position < source.length) {
                    const wkType = Buffer.from(source.substr(position, 2), "hex").toString();
                    position += 2;
                    const WorkingKey = source.substr(position, parseInt(wkLength) * 8 * 2);
                    position += parseInt(wkLength) * 8 * 2;
                    const ControlData = source.substr(position, 4);
                    position += 4;
                    const isValid = Object.values(WkLengthsRelation).includes(wkLength) &&
                        Object.values(WkTypesRelation).includes(wkType) &&
                        WorkingKey &&
                        ControlData;
                    if (isValid) {
                        workingKeys.push({ WorkingKeyLength: wkLength, WorkingKeyType: wkType, WorkingKey, ControlData });
                    }
                    else {
                        this.logger.warn(`[ Parse3DesFDRenewKeys ] - This key is not valid`, { logPrefix });
                    }
                }
                if (workingKeys.length)
                    return workingKeys;
            }
            else {
                this.logger.error("[ Parse3DesFDRenewKeys ] - New working keys response not present in host response.", { logPrefix });
            }
        });
    }
}
exports.Parse3DesFDRenewKeys = Parse3DesFDRenewKeys;
Parse3DesFDRenewKeys.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, Parse3DesFDRenewKeysITF_1.fieldsNameMappigns, Parse3DesFDRenewKeysITF_validator_1.default);
    return new Parse3DesFDRenewKeys(params);
};
