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
exports.SetValueMc = void 0;
const memjs_1 = __importDefault(require("memjs"));
const SetValueMcITF_1 = require("./SetValueMcITF");
const SetValueMcITF_validator_1 = __importDefault(require("./SetValueMcITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const mcConnections_1 = require("./mcConnections");
const NamedFields_1 = require("../../../utils/NamedFields");
class SetValueMc extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { address, key, fieldNameSource, expiration } = this.props;
            const connection = !mcConnections_1.connections[address] ? mcConnections_1.connections[address] : memjs_1.default.Client.create(address);
            mcConnections_1.connections[address] = connection;
            const value = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ SetValueMc ] - The memcache address is ${address}`, { logPrefix });
            this.logger.trace(`[ SetValueMc ] - The key is ${key}`, { logPrefix });
            this.logger.trace(`[ SetValueMc ] - The value to saved is ${value}`, { logPrefix });
            this.logger.trace(`[ SetValueMc ] - The expiration is ${expiration}`, { logPrefix });
            const result = yield connection.set(key, String(value), { expires: expiration });
            this.logger.trace(`[ SetValueMc ] - Value saved successfully: ${result}`, { logPrefix });
        });
    }
}
exports.SetValueMc = SetValueMc;
SetValueMc.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SetValueMcITF_1.fieldsNameMappigns, SetValueMcITF_validator_1.default);
    if (!mcConnections_1.connections[params.address])
        mcConnections_1.connections[params.address] = memjs_1.default.Client.create(params.address);
    return new SetValueMc(params);
};
