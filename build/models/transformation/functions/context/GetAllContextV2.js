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
exports.GetAllContextV2 = void 0;
const GetAllContextV2ITF_1 = require("./GetAllContextV2ITF");
const GetAllContextV2ITF_validator_1 = __importDefault(require("./GetAllContextV2ITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const CtxsCollection_1 = require("../../../contexts/CtxsCollection");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetAllContextV2 extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ctxInstanceName, fieldNameDest } = this.props;
            const { registry: { logPrefix }, } = contexts;
            const ctxs = yield CtxsCollection_1.CtxsCollection.getInstance(ctxInstanceName).getAll();
            if (ctxs) {
                const dataArray = ctxs.map(({ data }) => data);
                if (this.accessor.static.isContextRefStrict(fieldNameDest))
                    throw new Error("The destination field could not be just a reference");
                this.accessor.static.set(fieldNameDest, dataArray, contexts);
            }
            else {
                this.logger.error("[ GetAllContextV2 ] - Source message from context was not found. Ignoring this message", { logPrefix });
                throw new Error(`Message contexts were NOT found`);
            }
        });
    }
}
exports.GetAllContextV2 = GetAllContextV2;
GetAllContextV2.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetAllContextV2ITF_1.fieldsNameMappigns, GetAllContextV2ITF_validator_1.default);
    return new GetAllContextV2(params);
};
