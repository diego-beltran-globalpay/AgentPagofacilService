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
exports.GetKey = void 0;
const GetKeyITF_1 = require("./GetKeyITF");
const GetKeyITF_validator_1 = __importDefault(require("./GetKeyITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetKey extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { valuesFieldName = [] } = this.props;
            this.logger.trace(`[ GetKey ] - The funtion parameters are: ${valuesFieldName}`, { logPrefix });
            let contextKeyAux = "";
            for (const index in valuesFieldName) {
                const fieldName = valuesFieldName[index];
                const value = yield this.accessor.get(fieldName, contexts);
                contextKeyAux += value ? (!isNaN(value) ? parseInt(value) : value) + "_" : "";
            }
            //El SaveContext debe realizarse al final de todas las modificaciones que se deseen hacer al mensaje
            // a transformar, para asi poder generar la clave de contexto correctamente
            this.logger.trace(`[ GetKey ] - Saving source message into context with key [${contextKeyAux}]`, { logPrefix });
            return contextKeyAux;
        });
    }
}
exports.GetKey = GetKey;
GetKey.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetKeyITF_1.fieldsNameMappigns, GetKeyITF_validator_1.default);
    const valuesFieldName = [];
    Object.keys(params).forEach((name) => {
        const param = params[name];
        if (name.substr(0, GetKeyITF_1.FIELDS_KEY_NAME.length) === GetKeyITF_1.FIELDS_KEY_NAME)
            valuesFieldName.push(String(param));
    });
    return new GetKey({ valuesFieldName });
};
