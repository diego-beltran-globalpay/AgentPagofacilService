"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpListenerEndpoint = void 0;
const HttpEndpoint_1 = require("./HttpEndpoint");
const Message_1 = require("../../messages/Message");
const Endpoint_1 = require("../Endpoint");
class HttpListenerEndpoint extends HttpEndpoint_1.HttpEndpoint {
    constructor(porpouseType, formatters, request, response) {
        super(formatters);
        this.porpouseType = porpouseType;
        this.request = request;
        this.response = response;
        this.logPrefix = `[HttpListenerEndpoint][${this.id}]`;
        this.type = Endpoint_1.EndpointsTypes.HttpListener;
        this.setConnection = () => {
            const { request } = this;
            this.ip = request.socket.remoteAddress;
            this.port = request.socket.remotePort;
            switch (request.method) {
                case "POST":
                    let body = "";
                    request.on("data", data => {
                        body += data;
                        // Too much POST data, kill the connection!
                        if (body.length > 1e6 || body.length == 0) {
                            this.request.connection.destroy();
                        }
                    });
                    request.on("end", () => {
                        const contentType = request.headers["content-type"] || "none";
                        const accept = !request.headers["accept"] || request.headers["accept"] === "*/*" ? contentType : request.headers["accept"];
                        let messageID;
                        const messageIDHeader = request.headers["x-message-id"];
                        if (typeof messageIDHeader === "string")
                            messageID = messageIDHeader;
                        this.updateMsgReceivedCounter();
                        this.logger.trace(`[ HttpServer ][ ${this.porpouseType} ] - New raw body received`);
                        this.logger.trace(`[ HttpServer ][ ${this.porpouseType} ] - Content-Type: ${contentType}`);
                        this.logger.trace(`[ HttpServer ][ ${this.porpouseType} ] - Accept: ${accept}`);
                        const formatter = this.formatters[contentType.split(";")[0]];
                        const acceptFormater = this.formatters[accept.split(";")[0]];
                        if (formatter && acceptFormater) {
                            const message = new Message_1.Message(Buffer.from(body, "utf-8"), messageID);
                            message.transport = {
                                type: Endpoint_1.EndpointsTypes.HttpListener,
                                http: {
                                    reqHeaders: request.headers,
                                    host: this.ip,
                                    port: this.port,
                                    path: request.url,
                                    method: request.method,
                                },
                            };
                            formatter.decode(message);
                            message.setFormat(accept.split(";")[0]);
                            this.trigger("newMessage", this, message);
                        }
                        else {
                            this.logger.warn(`[ HttpServer ][ ${this.porpouseType} ] - Content-Type is not supported`);
                            this.response.statusCode = 415;
                            this.response.end();
                        }
                    });
                    break;
                case "GET":
                    if (request.url === "/echo") {
                        this.logger.info(`[ HttpServer ][ ${this.porpouseType} ] - Keep alive endpoint test rcv`);
                        this.response.statusCode = 200;
                        this.response.end();
                        return;
                    }
                    this.logger.warn(`[ HttpServer ][ ${this.porpouseType} ] - REST Method is not supported. Method: ${request.method}`);
                    this.response.statusCode = 404;
                    this.response.end();
                    break;
                case "OPTIONS":
                    this.logger.trace(`[ HttpServer ][ ${this.porpouseType} ] - New OPTIONS request received`);
                    this.logger.trace(`[ HttpServer ][ ${this.porpouseType} ] - Headers [${JSON.stringify(request.headers)}]`);
                    this.response.statusCode = 200;
                    this.response.setHeader("Allow", "OPTIONS, POST");
                    this.response.setHeader("Access-Control-Allow-Origin", "*");
                    this.response.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
                    this.response.end();
                    break;
                default:
                    this.logger.warn(`[ HttpServer ][ ${this.porpouseType} ] - REST Method is not supported. Method: ${request.method}`);
                    this.response.statusCode = 404;
                    this.response.end();
            }
        };
        this.setConnection();
    }
    close() {
        return;
    }
    send(message) {
        this.updateMsgSentCounter();
        // Set contennt-type to use
        let contentType = message.format || "application/json";
        // Take custom configs from _http element
        const { _http: { headers = {}, wrapWithArray = false, statusCode = 200 } = {} } = message.body;
        delete message.body._http;
        message.body = wrapWithArray ? [Object.assign({}, message.body)] : message.body;
        if (headers["Content-Type"])
            contentType = headers["Content-Type"];
        const bufferToSend = this.getFormatters(contentType).encode(message);
        this.response.setHeader("Content-Type", contentType);
        this.response.setHeader("Content-Length", bufferToSend.length);
        for (const headerName in headers) {
            this.response.setHeader(headerName, headers[headerName]);
        }
        this.response.statusCode = statusCode;
        this.response.end(bufferToSend);
    }
}
exports.HttpListenerEndpoint = HttpListenerEndpoint;
HttpListenerEndpoint.isInstanceOf = (obj) => obj.type === Endpoint_1.EndpointsTypes.HttpListener;
