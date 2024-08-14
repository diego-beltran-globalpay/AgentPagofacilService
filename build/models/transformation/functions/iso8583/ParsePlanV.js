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
exports.ParsePlanV = void 0;
const ParsePlanVITF_1 = require("./ParsePlanVITF");
const ParsePlanVITF_validator_1 = __importDefault(require("./ParsePlanVITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class ParsePlanV extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, facilityPaymentsQty } = this.props;
            const source = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.debug(`[ ParsePlanV ] - Plan V function started. Source: ${fieldNameSource}, Value: ${source}`, { logPrefix });
            const dinamicPlans = [];
            let position = 0;
            if (!source || typeof source !== "string") {
                this.logger.error("[ ParsePlanV ] - Plan V response not present in host response.", { logPrefix });
                return dinamicPlans;
            }
            const IssuerBank = source.substr(facilityPaymentsQty * 17 + 3);
            //const productCode = source.substr(position, 3);
            position += 3;
            for (let i = 0; i < facilityPaymentsQty; i++) {
                const cuota = source.substr(position, 2);
                position += 2;
                const valorCuota = source.substr(position, 10);
                position += 10;
                const tna = source.substr(position, 5);
                position += 5;
                const FacilityPayments = parseInt(cuota);
                const Value = parseFloat(valorCuota.substr(0, 8) + "." + valorCuota.substr(8));
                const TNA = tna.trim() != "" ? parseFloat(tna.substr(0, 3) + "." + tna.substr(3)) : undefined;
                const actualNumPlan = dinamicPlans.length;
                // Generamos una copia de este plan
                dinamicPlans[actualNumPlan] = {
                    FacilityPayments,
                    Value,
                    TNA,
                    IssuerBank,
                };
            }
            return dinamicPlans;
        });
    }
}
exports.ParsePlanV = ParsePlanV;
ParsePlanV.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ParsePlanVITF_1.fieldsNameMappigns, ParsePlanVITF_validator_1.default);
    return new ParsePlanV(params);
};
