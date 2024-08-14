"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCallerEndpoint = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const HttpEndpoint_1 = require("./HttpEndpoint");
const Message_1 = require("../../messages/Message");
const Endpoint_1 = require("../Endpoint");
const SecureOptions_1 = require("../SecureOptions");
const Types_1 = require("./Types");
const HTTP_DEFAULT_METHOD = "POST";
class HttpCallerEndpoint extends HttpEndpoint_1.HttpEndpoint {
    constructor(ip, port, path = "/", timeout = 60000, isSecure = false, rejectUnauthorized, formatters, authKey = null) {
        super(formatters);
        this.ip = ip;
        this.port = port;
        this.path = path;
        this.timeout = timeout;
        this.isSecure = isSecure;
        this.rejectUnauthorized = rejectUnauthorized;
        this.options = {};
        this.logPrefix = `[HttpCallerEndpoint][${this.id}]`;
        this.type = Endpoint_1.EndpointsTypes.HttpCaller;
        this.authenticationKey = authKey;
        this.isPermanent = true;
        this.configure();
        this.logger.info(`HTTP Enpoint created. Timeout: ${timeout} - IsSecure: ${isSecure} - RejectUnauthorized: ${rejectUnauthorized}`, {
            logPrefix: this.id,
        });
    }
    configure() {
        const options = {
            hostname: this.ip,
            port: this.port,
            path: this.path,
            method: HTTP_DEFAULT_METHOD,
            timeout: this.timeout * 1000,
            rejectUnauthorized: this.isSecure ? this.rejectUnauthorized : undefined,
        };
        this.options = options;
        this.isConnected = true;
    }
    get id() {
        return `${this.ip}:${this.port}${this.path}`;
    }
    close() {
        return;
    }
    send(message) {
        const { messageID } = message;
        const { _http: { headers = {}, noUseToken = false, relativePath = null, fullPath = null, wrapWithArray = false, timeout = null } = {} } = message.body;
        delete message.body._http;
        message.body = wrapWithArray ? [Object.assign({}, message.body)] : message.body;
        let contentType = message.format || "application/json";
        if (headers["Content-Type"])
            contentType = headers["Content-Type"];
        const buffer = this.getFormatters(contentType).encode(message);
        const options = JSON.parse(JSON.stringify(this.options));
        options.headers = {
            "Content-Type": contentType,
            "Content-Length": buffer.length,
        };
        if (headers instanceof Object)
            options.headers = Object.assign(Object.assign({}, options.headers), headers);
        if (!Boolean(noUseToken) && this.authenticationKey)
            options.headers["Authorization"] = `Bearer ${this.authenticationKey}`;
        if (fullPath)
            options.path = fullPath;
        if (relativePath)
            options.path += relativePath;
        if (!isNaN(parseInt(timeout)))
            options.timemout = parseInt(timeout);
        if (this.isSecure)
            options.secureOptions = SecureOptions_1.secureOptions;
        const requestFunc = this.isSecure ? https_1.default.request : http_1.default.request;
        const request = requestFunc(options, response => {
            let body = "";
            response.setEncoding("utf8");
            response.on("data", function (chunk) {
                body += chunk;
            });
            response.on("end", () => {
                this.updateMsgReceivedCounter();
                this.logger.info("Receive response from endpoint", { messageID });
                this.logger.trace(`Headers received: [${JSON.stringify(response.headers)}]`, { messageID });
                this.logger.trace(`Message received: [${body}]`, { messageID });
                const contentType = response.headers["content-type"] || "none";
                const formatter = this.formatters[contentType.split(";")[0]];
                if (formatter) {
                    const newMessage = new Message_1.Message(Buffer.from(body, "utf-8"), messageID);
                    newMessage.transport = {
                        type: Endpoint_1.EndpointsTypes.HttpCaller,
                        http: {
                            reqHeaders: request.getHeaders(),
                            respHeaders: response.headers,
                            host: this.ip,
                            port: this.port,
                            path: this.path,
                            method: HTTP_DEFAULT_METHOD,
                            internalStatus: Types_1.HttpInternalStatuses.OK,
                        },
                    };
                    formatter.decode(newMessage);
                    this.trigger("newMessage", this, newMessage);
                }
                else {
                    this.logger.warn(`Content-Type is not supported`, { messageID });
                }
            });
        });
        request.on("error", error => {
            this.logger.error(`An error was found when we tried to connect with this endpoint`, { messageID });
            this.logger.error(`${error.message}`, { messageID });
            const newMessage = new Message_1.Message({}, messageID);
            newMessage.transport = {
                type: Endpoint_1.EndpointsTypes.HttpCaller,
                http: {
                    reqHeaders: [],
                    respHeaders: [],
                    host: this.ip,
                    port: this.port,
                    path: this.path,
                    method: HTTP_DEFAULT_METHOD,
                    internalStatus: Types_1.HttpInternalStatuses.ERROR,
                },
            };
            this.trigger("newMessage", this, newMessage);
        });
        request.on("timeout", () => {
            request.destroy();
            const newMessage = new Message_1.Message({}, messageID);
            newMessage.transport = {
                type: Endpoint_1.EndpointsTypes.HttpCaller,
                http: {
                    reqHeaders: [],
                    respHeaders: [],
                    host: this.ip,
                    port: this.port,
                    path: this.path,
                    method: HTTP_DEFAULT_METHOD,
                    internalStatus: Types_1.HttpInternalStatuses.TIMEOOUT,
                },
            };
            this.trigger("newMessage", this, newMessage);
        });
        request.on("close", () => {
            this.logger.error(`Close connection`, { messageID });
        });
        this.updateMsgSentCounter();
        this.logger.trace(`Msg to send: ${buffer.toString("utf-8")} - Path: ${options.path} - Headers: ${JSON.stringify(options.headers)}`, {
            messageID,
        });
        request.write(buffer);
        request.end();
    }
}
exports.HttpCallerEndpoint = HttpCallerEndpoint;
HttpCallerEndpoint.isInstanceOf = (obj) => obj.type === Endpoint_1.EndpointsTypes.HttpCaller;
