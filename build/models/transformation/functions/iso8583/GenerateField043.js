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
exports.GenerateField043 = void 0;
const GenerateField043ITF_1 = require("./GenerateField043ITF");
const GenerateField043ITF_validator_1 = __importDefault(require("./GenerateField043ITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class GenerateField043 extends FunctionModel_1.FunctionModel {
    constructor(params) {
        super(params);
        if (!this.props.fieldNameDest)
            this.props.fieldNameDest = "043";
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { agregator, razonsocialName, direccionName, email, codposName, razonsocialDefault, direccionDefault, codposDefault } = this.props;
            let { telefono, regionCode, countryCode } = this.props;
            this.logger.debug(`[ GenerateField043 ] - Props: ${JSON.stringify(this.props)}`, { logPrefix });
            let razonsocial = yield this.accessor.get(razonsocialName, contexts);
            let direccion = yield this.accessor.get(direccionName, contexts);
            let codpos = yield this.accessor.get(codposName, contexts);
            if (!razonsocial)
                razonsocial = razonsocialDefault; // Valor por default
            if (!direccion)
                direccion = direccionDefault; // Valor por default
            if (!codpos)
                codpos = codposDefault; // Valor por default
            let aux = agregator + "=" + razonsocial;
            if (aux.length > 38)
                aux = aux.substr(0, 38);
            if (direccion.length > 30)
                direccion = direccion.substr(0, 30);
            if (telefono.length > 15)
                telefono = telefono.substr(0, 15);
            if (countryCode.toString().length > 3)
                countryCode = countryCode.substr(0, 3);
            else
                countryCode = countryCode + "   ".substr(0, 3 - countryCode.toString().length);
            if (regionCode.toString().length > 3)
                regionCode = regionCode.substr(0, 3);
            else
                regionCode = regionCode + "   ".substr(0, 3 - regionCode.toString().length);
            if (codpos.toString().length > 10)
                codpos = codpos.substr(0, 10);
            else
                codpos = codpos + "          ".substr(0, 10 - codpos.toString().length);
            const result = `${aux}\\${direccion}\\${telefono}\\${email}\\${codpos}\\${regionCode}\\${countryCode}`;
            return result;
        });
    }
}
exports.GenerateField043 = GenerateField043;
GenerateField043.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GenerateField043ITF_1.fieldsNameMappigns, GenerateField043ITF_validator_1.default);
    return new GenerateField043(params);
};
