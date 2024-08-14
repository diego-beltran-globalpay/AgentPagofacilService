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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticator = void 0;
const uuid = __importStar(require("uuid"));
const EndpointMsgsCreator_1 = require("../../../models/endpoints/controlMsgs/EndpointMsgsCreator");
const TcpCallerEndpoint_1 = require("../../../models/endpoints/tcp/TcpCallerEndpoint");
const endpointStates = {
    sendLogin: "sendLogin",
    waitingLoginResponse: "waitingLoginResponse",
};
class Authenticator extends EndpointMsgsCreator_1.EndpointMsgsCreator {
    constructor(msgsAvb, interval) {
        super(endpointStates, endpointStates.sendLogin, msgsAvb, interval);
        this.logPrefix = `[${uuid.v1()}][Authenticator]`;
        this.sendMsgs = () => __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const logPrefix = `${this.logPrefix}[${uuid.v1()}]`;
            this.logger.trace(`Start control msgs process`, { logPrefix });
            for (const epID in this.endpoints) {
                let msgToSend;
                const { state, endpoint } = this.endpoints[epID];
                this.logger.trace(`Checking status of endpoint with id ${epID}. Connection Status: ${endpoint.isConnected}`, { logPrefix });
                if (endpoint.isConnected) {
                    switch (state) {
                        case endpointStates.sendLogin:
                            this.logger.trace(`Sending authentication msg to endpoint`, { logPrefix });
                            msgToSend = yield this.keepAliveMsgs.tokenAuth.get(this.getInitBody(endpoint));
                            if (msgToSend) {
                                endpoint.updateTestMsgSentCounter();
                                endpoint.send(msgToSend);
                                this.endpoints[epID].state = endpointStates.waitingLoginResponse;
                            }
                            else {
                                this.logger.trace(`Authentication msg was not generated. We will not send it.`, { logPrefix });
                                this.endpoints[epID].state = endpointStates.sendLogin;
                            }
                            break;
                        case endpointStates.waitingLoginResponse:
                            this.logger.trace(`Authentication response was not rcv`, { logPrefix });
                            endpoint.close();
                            if (!endpoint.isPermanent) {
                                this.logger.trace(`We will delete this endpoint from array because it is not a caller one`, { logPrefix });
                                this.deleteEndpoint(epID);
                            }
                            else {
                                this.endpoints[epID].state = this.initState;
                            }
                            break;
                    }
                }
            }
        });
        this.analizeRcvMsg = (endpoint, message) => __awaiter(this, void 0, void 0, function* () {
            const foundEp = this.endpoints[endpoint.id];
            const { messageID } = message;
            if (foundEp) {
                switch (foundEp.state) {
                    case endpointStates.waitingLoginResponse:
                        const { tokenAuth } = this.keepAliveMsgs;
                        const { founded: isTrue, msgResult } = yield tokenAuth.analize(message);
                        if (isTrue) {
                            const { _token = null } = msgResult || {};
                            this.logger.trace(`Authorization response was rcv. Token: ${_token}`, { messageID });
                            if (_token)
                                endpoint.authenticationKey = _token;
                            endpoint.updateTestMsgReceivedCounter();
                            this.endpoints[endpoint.id].state = endpointStates.sendLogin;
                            return true;
                        }
                        break;
                }
            }
            return false;
        });
    }
    addEndpoint(endpoint) {
        this.innerAddEndpoint(endpoint);
        if (endpoint.isPermanent) {
            if (endpoint instanceof TcpCallerEndpoint_1.TcpCallerEndpoint) {
                endpoint.on("reconnectConnection", () => {
                    this.innerAddEndpoint(endpoint);
                });
            }
        }
    }
    deleteEndpoint(id) {
        const { logPrefix } = this;
        this.logger.trace(`Delete endpoint with id ${id} from inside of this endpoint tester`, { logPrefix });
        delete this.endpoints[id];
    }
}
exports.Authenticator = Authenticator;
