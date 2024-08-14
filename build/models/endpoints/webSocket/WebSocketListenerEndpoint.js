"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketListenerEndpoint = void 0;
const WebSocketEndpoint_1 = require("./WebSocketEndpoint");
const Message_1 = require("../../messages/Message");
const Endpoint_1 = require("../Endpoint");
class WebSocketListenerEndpoint extends WebSocketEndpoint_1.WebSocketEndpoint {
    constructor(porpouseType, formatters, initialRequest, webSocket) {
        super(formatters);
        this.porpouseType = porpouseType;
        this.initialRequest = initialRequest;
        this.webSocket = webSocket;
        this.logPrefix = `[WebSocketListenerEndpoint][${this.id}]`;
        this.type = Endpoint_1.EndpointsTypes.WebSocketListener;
        this.setConnection = () => {
            this.webSocket.on("message", (data) => {
                this.updateMsgReceivedCounter();
                this.logger.trace(`[ WsServer ][ ${this.porpouseType} ] - New raw body received`);
                this.logger.trace(`[ WsServer ][ ${this.porpouseType} ] - Content-Type: ${this.contentType}`);
                const formatter = this.formatters[this.contentType];
                if (formatter) {
                    const body = data instanceof Buffer ? data : Buffer.from(data.toString(), "utf-8");
                    const message = new Message_1.Message(body);
                    formatter.decode(message);
                    this.trigger("newMessage", this, message);
                }
            });
            this.webSocket.on("close", () => {
                this.logger.debug(`Connection endpoint closed`, { logPrefix: this.id });
                this.isConnected = false;
                this.trigger("closeConnection");
            });
        };
        this.contentType = initialRequest.headers["content-type"] || "application/json";
        this.ip = initialRequest.socket.remoteAddress;
        this.port = initialRequest.socket.remotePort;
        this.isConnected = true;
        this.logger.trace(`WebSocket Listener Endpoint connected.`, { logPrefix: `${this.ip}.${this.port}` });
        this.logger.trace(`Content-Type: ${this.contentType}`, { logPrefix: `${this.ip}.${this.port}` });
        this.setConnection();
        if (!this.formatters[this.contentType]) {
            this.logger.error(`ContentType not supported. Closing connection`, { logPrefix: `${this.ip}.${this.port}` });
            webSocket.close();
        }
    }
    close() {
        return;
    }
    send(message) {
        this.updateMsgSentCounter();
        const bufferToSend = this.formatters[this.contentType].encode(message);
        this.webSocket.send(bufferToSend, err => {
            if (err)
                this.logger.debug(`The message sent was not received`, { logPrefix: message.messageID });
        });
    }
}
exports.WebSocketListenerEndpoint = WebSocketListenerEndpoint;
WebSocketListenerEndpoint.isInstanceOf = (obj) => obj.type === Endpoint_1.EndpointsTypes.WebSocketListener;
