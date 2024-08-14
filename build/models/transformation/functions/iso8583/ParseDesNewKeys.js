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
exports.ParseDesNewKeys = void 0;
const ParseDesNewKeysITF_1 = require("./ParseDesNewKeysITF");
const ParseDesNewKeysITF_validator_1 = __importDefault(require("./ParseDesNewKeysITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const WkLengthsRelation = {
    "16": "S",
    "32": "D",
    "48": "T",
};
const WkTypesRelation = {
    "1": "Data",
    "2": "PIN",
};
class ParseDesNewKeys extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource } = this.props;
            const source = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ ParseDesNewKeys ] - Parsing new keys from response. Source: ${fieldNameSource}, Value: ${source}`, {
                logPrefix,
            });
            const workingKeys = [];
            if (!source || typeof source !== "string") {
                this.logger.error("[ ParseDesNewKeys ] - New working keys response not present in host response.", { logPrefix });
                return workingKeys;
            }
            const wkLength = source.length.toString();
            const isValid = Object.values(WkLengthsRelation).includes(wkLength);
            if (isValid) {
                workingKeys.push({
                    WorkingKey: source,
                    WorkingKeyType: WkTypesRelation["1"],
                    WorkingKeyLength: WkLengthsRelation[wkLength],
                    ControlData: "9999",
                });
                workingKeys.push({
                    WorkingKey: source,
                    WorkingKeyType: WkTypesRelation["2"],
                    WorkingKeyLength: WkLengthsRelation[wkLength],
                    ControlData: "9999",
                });
            }
            else {
                this.logger.error(`[ ParseDesNewKeys ] - This key length is not valid`, { logPrefix });
            }
            if (workingKeys.length)
                return workingKeys;
        });
    }
}
exports.ParseDesNewKeys = ParseDesNewKeys;
ParseDesNewKeys.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ParseDesNewKeysITF_1.fieldsNameMappigns, ParseDesNewKeysITF_validator_1.default);
    return new ParseDesNewKeys(params);
};
