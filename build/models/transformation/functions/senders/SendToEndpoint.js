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
exports.SendToEndpoint = void 0;
const SendToEndpointITF_1 = require("./SendToEndpointITF");
const SendToEndpointITF_validator_1 = __importDefault(require("./SendToEndpointITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const GlobalEndpointCollection_1 = require("../../../endpoints/globalAccess/GlobalEndpointCollection");
const Message_1 = require("../../../messages/Message");
class SendToEndpoint extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, endpointName } = this.props;
            const sourceData = yield this.accessor.get(fieldNameSource, contexts);
            const endpoint = GlobalEndpointCollection_1.GlobalEndpointCollection.get().getEndpoint(endpointName);
            if (sourceData && endpoint) {
                const { _http: { headers = {} } = {} } = sourceData;
                delete sourceData._http;
                const msgToSend = JSON.stringify(sourceData);
                this.logger.debug(`[ SendToEndpoint ] - We will send this message ${msgToSend} to endpoint ${endpointName}`, { logPrefix });
                endpoint.send(new Message_1.Message(sourceData));
            }
            else {
                this.logger.error(`[ SendToEndpoint ] - Source data is empty or the endpoint is not present`, { logPrefix });
            }
        });
    }
}
exports.SendToEndpoint = SendToEndpoint;
SendToEndpoint.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SendToEndpointITF_1.fieldsNameMappigns, SendToEndpointITF_validator_1.default);
    return new SendToEndpoint(params);
};
