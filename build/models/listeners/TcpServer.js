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
exports.TcpServer = void 0;
const fs_1 = __importDefault(require("fs"));
const net_1 = __importDefault(require("net"));
const tls_1 = __importDefault(require("tls"));
const uuid = __importStar(require("uuid"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
const Protocol_1 = require("../protocol/Protocol");
const SecureOptions_1 = require("../endpoints/SecureOptions");
const TcpListenerEndpoint_1 = require("../endpoints/tcp/TcpListenerEndpoint");
const tlsVersions_1 = require("./tls/tlsVersions");
const CustomUtils_1 = require("../../modules/utils/CustomUtils");
const Events_1 = require("../Events");
class TcpServer extends Events_1.Events {
    constructor(type, protocolProps, parser) {
        super({ newConnection: [] });
        this.type = type;
        this.protocolProps = protocolProps;
        this.parser = parser;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[TcpServer][${uuid.v1()}]`;
        this.setLogPrefix = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
            return this;
        };
        this.props = parser.parseProperties(type);
        this.groupIdsByAddress = this.props.listenGroup ? CustomUtils_1.CustomUtils.parseGroupIDs(this.props.listenGroup) : {};
    }
    start() {
        const { logPrefix } = this;
        const { enableTls, listenIp, listenPort, maxConnections } = this.props;
        if (enableTls) {
            const { tlsCertPath, tlsKeyPath, tlsRequestCert, tlsRejectUnauthorized, tlsMaxVersion, tlsMinVersion, tlsCaPath } = this.props;
            if (!tlsCertPath || !tlsKeyPath || !fs_1.default.existsSync(tlsCertPath) || !fs_1.default.existsSync(tlsKeyPath)) {
                this.logger.error(`[ start ] - Tls cert and key are required. We could not start TCP TLS server`, { logPrefix });
                throw new Error("Tls cert and key are required. We could not start TCP TLS server");
            }
            const tlsOptions = {
                key: fs_1.default.readFileSync(tlsKeyPath),
                cert: fs_1.default.readFileSync(tlsCertPath),
                requestCert: tlsRequestCert,
                rejectUnauthorized: tlsRejectUnauthorized,
                maxVersion: tlsVersions_1.tlsVersions[tlsMaxVersion] || tlsVersions_1.tlsVersions["1_3"],
                minVersion: tlsVersions_1.tlsVersions[tlsMinVersion] || tlsVersions_1.tlsVersions["1_2"],
                ca: tlsCaPath && fs_1.default.existsSync(tlsCaPath) ? fs_1.default.readFileSync(tlsCaPath) : undefined,
                secureOptions: SecureOptions_1.secureOptions,
            };
            this.server = tls_1.default.createServer(tlsOptions, socket => {
                this.handleTcpRequest(this, socket);
            });
            this.logger.info(`[ start ] - Tcp tls server listenning to incomming requests on ${listenIp}:${listenPort}`, { logPrefix });
        }
        else {
            this.server = net_1.default.createServer({}, socket => {
                this.handleTcpRequest(this, socket);
            });
            this.logger.info(`[ start ] - Tcp server listenning to incomming requests on ${listenIp}:${listenPort}`, { logPrefix });
        }
        this.logger.debug(`[ start ] - Own Props: [${JSON.stringify(this.props)}]`, { logPrefix });
        this.logger.debug(`[ start ] - Protocol config: [${JSON.stringify(this.protocolProps)}]`, { logPrefix });
        if (maxConnections) {
            this.server.maxConnections = maxConnections;
            this.logger.info(`[ start ] - Tcp server max connections allowed are ${maxConnections}`, { logPrefix });
        }
        this.server.listen(listenPort, listenIp);
    }
    handleTcpRequest(server, socket) {
        const { socketTimeout } = this.props;
        const { formatter, packetLength, header, trailer, checkSum, escape, ack, nack, enq, eot, options } = this.protocolProps;
        const protocol = new Protocol_1.Protocol(formatter, packetLength, header, trailer, checkSum, escape, ack, nack, enq, eot, options);
        const endpoint = new TcpListenerEndpoint_1.TcpListenerEndpoint(socket, protocol);
        if (socketTimeout)
            socket.setTimeout(socketTimeout);
        server.trigger("newConnection", endpoint, server.groupIdsByAddress[endpoint.id] || "-1");
    }
}
exports.TcpServer = TcpServer;
