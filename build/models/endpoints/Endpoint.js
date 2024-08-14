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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = exports.EndpointsTypes = void 0;
const uuid = __importStar(require("uuid"));
var EndpointsTypes;
(function (EndpointsTypes) {
    EndpointsTypes["Tcp"] = "Tcp";
    EndpointsTypes["Http"] = "Http";
    EndpointsTypes["Serial"] = "Serial";
    EndpointsTypes["WebSocket"] = "WebSocket";
    EndpointsTypes["TcpCaller"] = "TcpCaller";
    EndpointsTypes["TcpListener"] = "TcpListener";
    EndpointsTypes["HttpCaller"] = "HttpCaller";
    EndpointsTypes["HttpListener"] = "HttpListener";
    EndpointsTypes["WebSocketCaller"] = "WebSocketCaller";
    EndpointsTypes["WebSocketListener"] = "WebSocketListener";
    EndpointsTypes["SerialCaller"] = "SerialCaller";
    EndpointsTypes["SerialListener"] = "SerialListener";
})(EndpointsTypes = exports.EndpointsTypes || (exports.EndpointsTypes = {}));
const initStat = {
    createDateTime: new Date(),
    lastSent: null,
    lastReceived: null,
    lastRcvControl: null,
    lastSentControl: null,
    respAverageTime: 0,
    messageSentCounter: 0,
    messageReceivedCounter: 0,
    messageReplyCounter: 0,
    testMessagesSentCounter: 0,
    testMessagesReceivedCounter: 0,
};
class Endpoint {
    constructor() {
        this.isConnected = false;
        this.isPermanent = false;
        this.internalID = uuid.v1();
        this.authenticationKey = null;
        this.stats = initStat;
        this.autoReply = (body) => {
            this.stats.messageReplyCounter++;
            this.send(body);
        };
    }
    updateMsgReceivedCounter() {
        this.stats.messageReceivedCounter++;
        this.stats.lastReceived = new Date();
    }
    updateMsgSentCounter() {
        this.stats.messageSentCounter++;
        this.stats.lastSent = new Date();
    }
    updateTestMsgReceivedCounter() {
        this.stats.testMessagesReceivedCounter++;
        this.stats.lastRcvControl = new Date();
    }
    updateTestMsgSentCounter() {
        this.stats.testMessagesSentCounter++;
        this.stats.lastSentControl = new Date();
    }
    updateResponseAvgTime(sentTime, rcvTime) {
        const { messageSentCounter } = this.stats;
        let { respAverageTime } = this.stats;
        const rcvTimestamp = rcvTime.getTime();
        const sentTimestamp = sentTime.getTime();
        // Si es el primer envio, el valor del promedio es el tomado para el envio
        // Si no es el primero, para calcular el nuevo promedio, primero calculamos la suma de los tiempos de los envios anteriores, como valor anterior, multiplicado
        //por la cantidad de envios antes de realizarce el ultimo. A partir de alli, le sumamos el nuevo tiempo de envio, y lo dividimos por la cantidad de envios
        respAverageTime =
            messageSentCounter === 1
                ? rcvTimestamp - sentTimestamp
                : (respAverageTime * (messageSentCounter - 1) + (rcvTimestamp - sentTimestamp)) / messageSentCounter;
        this.stats.respAverageTime = respAverageTime;
    }
    restartStats() {
        this.stats = initStat;
    }
}
exports.Endpoint = Endpoint;
