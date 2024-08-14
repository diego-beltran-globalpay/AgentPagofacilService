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
exports.DecodeTrack2 = void 0;
const DecodeTrack2ITF_1 = require("./DecodeTrack2ITF");
const DecodeTrack2ITF_validator_1 = __importDefault(require("./DecodeTrack2ITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class DecodeTrack2 extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, fieldNameToDecode } = this.props;
            let separator = "=";
            const trackII = yield this.accessor.get(fieldNameSource, contexts);
            const toDecode = yield this.accessor.get(fieldNameToDecode, contexts);
            // Buscamos para verificar si viene con D como separador
            if (trackII && trackII.indexOf("D") > -1)
                separator = "D";
            this.logger.trace(`[ DecodeTrackII ] - TrackII value: ${trackII}. Mode: ${toDecode}`, { logPrefix });
            if (trackII) {
                if (toDecode == "Card")
                    return trackII.split(separator)[0];
                else if (toDecode == "ExpDate")
                    return trackII.split(separator)[1].substring(0, 4);
                else
                    throw new Error("ToDecode type is not valid");
            }
            else {
                this.logger.error("[ DecodeTrackII ] - TrackII not found.", { logPrefix });
            }
        });
    }
}
exports.DecodeTrack2 = DecodeTrack2;
DecodeTrack2.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, DecodeTrack2ITF_1.fieldsNameMappigns, DecodeTrack2ITF_validator_1.default);
    return new DecodeTrack2(params);
};
