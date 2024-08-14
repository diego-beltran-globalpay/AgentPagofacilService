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
exports.SendRawDataToEndpoint = void 0;
const SendRawDataToEndpointITF_1 = require("./SendRawDataToEndpointITF");
const SendRawDataToEndpointITF_validator_1 = __importDefault(require("./SendRawDataToEndpointITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const GlobalEndpointCollection_1 = require("../../../endpoints/globalAccess/GlobalEndpointCollection");
const TcpEndpoint_1 = require("../../../endpoints/tcp/TcpEndpoint");
const SerialEndpoint_1 = require("../../../endpoints/serial/SerialEndpoint");
class SendRawDataToEndpoint extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, type, endpointName } = this.props;
            const sourceData = yield this.accessor.get(fieldNameSource, contexts);
            const endpoint = GlobalEndpointCollection_1.GlobalEndpointCollection.get().getEndpoint(endpointName);
            if (sourceData && endpoint) {
                if (TcpEndpoint_1.TcpEndpoint.isInstanceOf(endpoint) || SerialEndpoint_1.SerialEndpoint.isInstanceOf(endpoint)) {
                    this.logger.debug(`[ SendRawDataToEndpoint ] - We will send this message [${sourceData}] with encoding [${type}] to endpoint ${endpointName}`, {
                        logPrefix,
                    });
                    endpoint.sendRawData(Buffer.from(sourceData, type));
                }
                else {
                    this.logger.error(`[ SendRawDataToEndpoint ] - The endpoint is not Tcp o Serial type`, { logPrefix });
                }
            }
            else {
                this.logger.error(`[ SendRawDataToEndpoint ] - Source data is empty or the endpoint is not present`, { logPrefix });
            }
        });
    }
}
exports.SendRawDataToEndpoint = SendRawDataToEndpoint;
SendRawDataToEndpoint.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SendRawDataToEndpointITF_1.fieldsNameMappigns, SendRawDataToEndpointITF_validator_1.default);
    return new SendRawDataToEndpoint(params);
};
