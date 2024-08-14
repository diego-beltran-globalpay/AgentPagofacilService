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
exports.GetNextNumberMc = void 0;
const memjs_1 = __importDefault(require("memjs"));
const GetNextNumberMcITF_1 = require("./GetNextNumberMcITF");
const GetNextNumberMcITF_validator_1 = __importDefault(require("./GetNextNumberMcITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const mcConnections_1 = require("../memcache/mcConnections");
const NamedFields_1 = require("../../../utils/NamedFields");
class GetNextNumberMc extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { address, key, step, initValue } = this.props;
            const connection = !mcConnections_1.connections[address] ? mcConnections_1.connections[address] : memjs_1.default.Client.create(address);
            mcConnections_1.connections[address] = connection;
            const keyRegValue = yield this.accessor.get(key, contexts);
            this.logger.trace(`[ GetNextNumberMc ] - The memcache address is ${address}`, { logPrefix });
            this.logger.trace(`[ GetNextNumberMc ] - The key value is ${keyRegValue}`, { logPrefix });
            const { success, value } = yield connection.increment(String(keyRegValue), step || 1, { initial: initValue });
            this.logger.trace(`[ GetNextNumberMc ] - Next number value: ${value}`, { logPrefix });
            return success ? (value !== null ? value : initValue) : undefined;
        });
    }
}
exports.GetNextNumberMc = GetNextNumberMc;
GetNextNumberMc.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetNextNumberMcITF_1.fieldsNameMappigns, GetNextNumberMcITF_validator_1.default);
    params.initValue = params.initValue === undefined ? 1 : params.initValue;
    params.step = params.step === undefined ? 1 : params.step;
    if (!mcConnections_1.connections[params.address])
        mcConnections_1.connections[params.address] = memjs_1.default.Client.create(params.address);
    return new GetNextNumberMc(params);
};
