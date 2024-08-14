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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const fs_1 = __importDefault(require("fs"));
const uuid = __importStar(require("uuid"));
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
const CustomUtils_1 = require("../../modules/utils/CustomUtils");
const Events_1 = require("../Events");
const WebSocketListenerEndpoint_1 = require("../endpoints/webSocket/WebSocketListenerEndpoint");
const SecureOptions_1 = require("../endpoints/SecureOptions");
class WebSocketServer extends Events_1.Events {
    constructor(type, parser, formatters) {
        super({ newConnection: [] });
        this.type = type;
        this.parser = parser;
        this.formatters = formatters;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[WebSocket][${uuid.v1()}]`;
        this.setLogPrefix = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
            return this;
        };
        this.props = parser.parseProperties(type);
        this.groupIdsByAddress = this.props.listenGroup ? CustomUtils_1.CustomUtils.parseGroupIDs(this.props.listenGroup) : {};
    }
    start() {
        const { logPrefix } = this;
        const { enableWss, listenIp, listenPort, maxConnections, socketTimeout, requestTimeout } = this.props;
        let externalHttpServer;
        if (enableWss) {
            const { wssCertPath: httpsCertPath, wssKeyPath: httpsKeyPath, wssCaPath: httpsCaPath } = this.props;
            if (!httpsCertPath || !httpsKeyPath || !fs_1.default.existsSync(httpsCertPath) || !fs_1.default.existsSync(httpsKeyPath)) {
                this.logger.error(`[ start ] - Tls cert and key are required. We could not start HTTPS server`, { logPrefix });
                throw new Error("Tls cert and key are required. We could not start HTTPS server");
            }
            const options = {
                key: fs_1.default.readFileSync(httpsKeyPath, "utf-8"),
                cert: fs_1.default.readFileSync(httpsCertPath, "utf-8"),
                secureOptions: SecureOptions_1.secureOptions,
            };
            if (httpsCaPath && fs_1.default.existsSync(httpsCaPath))
                options.ca = fs_1.default.readFileSync(httpsCaPath, "utf-8");
            externalHttpServer = https_1.default.createServer(options);
            this.logger.info(`[ start ] - WebSocket secure server listenning to incomming requests on ${listenIp}:${listenPort}`, { logPrefix });
        }
        else {
            externalHttpServer = http_1.default.createServer();
            this.logger.info(`[ start ] - WebSocket server listenning to incomming requests on ${listenIp}:${listenPort}`, { logPrefix });
        }
        if (maxConnections) {
            externalHttpServer.maxConnections = maxConnections;
            this.logger.info(`[ start ] - WebSocket server max connections allowed are ${maxConnections}`, { logPrefix });
        }
        if (requestTimeout) {
            externalHttpServer.requestTimeout = requestTimeout;
            this.logger.info(`[ start ] - WebSocket server request timeout is ${requestTimeout}`, { logPrefix });
        }
        if (socketTimeout) {
            externalHttpServer.setTimeout(socketTimeout, () => {
                this.logger.error(`Socket timeout`, { logPrefix });
            });
        }
        this.server = new ws_1.default.Server({ server: externalHttpServer });
        this.server.on("connection", (webSocket, initialRequest) => {
            this.handleWebSocketRequest(this, initialRequest, webSocket);
        });
        externalHttpServer.listen(listenPort, listenIp);
    }
    handleWebSocketRequest(server, initialRrequest, webSocket) {
        const endpoint = new WebSocketListenerEndpoint_1.WebSocketListenerEndpoint(server.type, server.formatters, initialRrequest, webSocket);
        server.trigger("newConnection", endpoint, server.groupIdsByAddress[endpoint.id] || "-1");
    }
}
exports.WebSocketServer = WebSocketServer;
