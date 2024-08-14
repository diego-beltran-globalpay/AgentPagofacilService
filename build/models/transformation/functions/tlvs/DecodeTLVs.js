"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.DecodeTLVs = void 0;
const util_1 = __importDefault(require("util"));
const node_emv_1 = __importStar(require("node-emv"));
const DecodeTLVsITF_1 = require("./DecodeTLVsITF");
const DecodeTLVsITF_validator_1 = __importDefault(require("./DecodeTLVsITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const describe = util_1.default.promisify(node_emv_1.default.describe);
class DecodeTLVs extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, prefix, resultDestRef } = this.props;
            const cardCryptogram = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.error(`[ DecodeTLV ] - The card cryptogram value is ${cardCryptogram}`, { logPrefix });
            if (cardCryptogram && typeof cardCryptogram === "string") {
                const reference = (yield this.accessor.static.getReference(resultDestRef, contexts));
                let data;
                try {
                    data = yield describe(cardCryptogram);
                }
                catch (error) {
                    if (node_emv_1.isDescribeResponse(error)) {
                        data = error;
                    }
                    else {
                        this.logger.error("[ DecodeTLV ] - The card cryptogram colud not be parsed", { logPrefix });
                        throw error;
                    }
                }
                if (data) {
                    data.forEach(({ tag, value }) => {
                        reference[`${prefix}${tag}`] = value;
                    });
                    this.logger.trace("[ DecodeTLV ] - Card cryptogram parsed", { logPrefix });
                }
                else {
                    this.logger.error("[ DecodeTLV ] - The card cryptogram colud not be parsed", { logPrefix });
                }
            }
            else {
                this.logger.error("[ DecodeTLV ] - The CardCryptogram to use is empty.", { logPrefix });
            }
        });
    }
}
exports.DecodeTLVs = DecodeTLVs;
DecodeTLVs.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, DecodeTLVsITF_1.fieldsNameMappigns, DecodeTLVsITF_validator_1.default);
    return new DecodeTLVs(params);
};
