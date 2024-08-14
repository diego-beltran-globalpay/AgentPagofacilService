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
exports.ParseAmexGCAGRespCC = void 0;
const ParseAmexGCAGRespCCITF_1 = require("./ParseAmexGCAGRespCCITF");
const ParseAmexGCAGRespCCITF_validator_1 = __importDefault(require("./ParseAmexGCAGRespCCITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class ParseAmexGCAGRespCC extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource } = this.props;
            const emvResponse = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ ParseAmexGCAGRespCC ] - Parsing the Amex GCAG card cryptogram response. Source: ${fieldNameSource}, Value: ${emvResponse}`, {
                logPrefix,
            });
            if (!emvResponse || typeof emvResponse === "string") {
                this.logger.error("[ ParseAmexGCAGRespCC ] - The card cryptogram response is emtpy.", { logPrefix });
                return undefined;
            }
            else if (emvResponse.substr(0, 12) !== "C1C7D5E20001") {
                this.logger.error("[ ParseAmexGCAGRespCC ] - The card cryptogram response is not correctly formatted. It has to start with C1C7D5E20001", {
                    logPrefix,
                });
                return undefined;
            }
            const tagsToParse = emvResponse.substr(12);
            if (!tagsToParse.length) {
                this.logger.error("[ ParseAmexGCAGRespCC ] - The card cryptogram response has not tags inside it.", { logPrefix });
                return undefined;
            }
            else {
                let startPos = 0;
                let length = parseInt(tagsToParse.substr(startPos, 2), 16) * 2;
                const tag91 = "91" + tagsToParse.substr(startPos, length + 2);
                startPos += length + 2;
                this.logger.trace(`[ ParseAmexGCAGRespCC ] - The tag 91 is: ${tag91}`, { logPrefix });
                length = parseInt(tagsToParse.substr(startPos, 2), 16) * 2;
                startPos += 2;
                const tag71and72 = tagsToParse.substr(startPos, length);
                this.logger.trace(`[ ParseAmexGCAGRespCC ] - The tag 71 and/or 72 is: ${tag71and72}`, { logPrefix });
                this.logger.trace(`[ ParseAmexGCAGRespCC ] - The final card cryptogram response is: ${tag91 + tag71and72}`, { logPrefix });
                return tag91 + tag71and72;
            }
        });
    }
}
exports.ParseAmexGCAGRespCC = ParseAmexGCAGRespCC;
ParseAmexGCAGRespCC.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ParseAmexGCAGRespCCITF_1.fieldsNameMappigns, ParseAmexGCAGRespCCITF_validator_1.default);
    return new ParseAmexGCAGRespCC(params);
};
