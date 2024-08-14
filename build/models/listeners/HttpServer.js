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
exports.HttpServer = void 0;
const fs_1 = __importDefault(require("fs"));
const uuid = __importStar(require("uuid"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
const CustomUtils_1 = require("../../modules/utils/CustomUtils");
const Events_1 = require("../Events");
const HttpListenerEndpoint_1 = require("../endpoints/http/HttpListenerEndpoint");
const SecureOptions_1 = require("../endpoints/SecureOptions");
class HttpServer extends Events_1.Events {
    constructor(type, parser, formatters) {
        super({ newConnection: [] });
        this.type = type;
        this.parser = parser;
        this.formatters = formatters;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[HttpServer][${uuid.v1()}]`;
        this.setLogPrefix = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
            return this;
        };
        this.props = parser.parseProperties(type);
        this.groupIdsByAddress = this.props.listenGroup ? CustomUtils_1.CustomUtils.parseGroupIDs(this.props.listenGroup) : {};
    }
    start() {
        const { logPrefix } = this;
        const { enableHttps, listenIp, listenPort, maxConnections, socketTimeout, requestTimeout } = this.props;
        if (enableHttps) {
            const { httpsCertPath, httpsKeyPath, httpsCaPath } = this.props;
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
            this.server = https_1.default.createServer(options, (request, response) => {
                this.handleHttpRequest(this, request, response);
            });
            this.logger.info(`[ start ] - Https server listenning to incomming requests on ${listenIp}:${listenPort}`, { logPrefix });
        }
        else {
            this.server = http_1.default.createServer((request, response) => {
                this.handleHttpRequest(this, request, response);
            });
            this.logger.info(`[ start ] - Http server listenning to incomming requests on ${listenIp}:${listenPort}`, { logPrefix });
        }
        if (maxConnections) {
            this.server.maxConnections = maxConnections;
            this.logger.info(`[ start ] - Http server max connections allowed are ${maxConnections}`, { logPrefix });
        }
        if (requestTimeout) {
            this.server.requestTimeout = requestTimeout;
            this.logger.info(`[ start ] - Http server request timeout is ${requestTimeout}`, { logPrefix });
        }
        if (socketTimeout) {
            this.server.setTimeout(socketTimeout, () => {
                this.logger.error(`Socket timeout`, { logPrefix });
            });
        }
        this.server.listen(listenPort, listenIp);
    }
    handleHttpRequest(server, request, response) {
        const endpoint = new HttpListenerEndpoint_1.HttpListenerEndpoint(server.type, server.formatters, request, response);
        server.trigger("newConnection", endpoint, server.groupIdsByAddress[endpoint.id] || "-1");
    }
}
exports.HttpServer = HttpServer;
