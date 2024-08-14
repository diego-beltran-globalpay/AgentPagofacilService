"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpCallerEndpoint = void 0;
const net_1 = __importDefault(require("net"));
const tls_1 = __importDefault(require("tls"));
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const TcpEndpoint_1 = require("./TcpEndpoint");
const Timer_1 = require("../../Timer");
const SecureOptions_1 = require("../SecureOptions");
const Endpoint_1 = require("../Endpoint");
class TcpCallerEndpoint extends TcpEndpoint_1.TcpEndpoint {
    constructor(ip, port, timeout, isSecure, reconnectTime, protocol) {
        super(protocol);
        this.ip = ip;
        this.port = port;
        this.timeout = timeout;
        this.isSecure = isSecure;
        this.reconnectTime = reconnectTime;
        this.protocol = protocol;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[TcpCallerEndpoint][${this.id}]`;
        this.type = Endpoint_1.EndpointsTypes.TcpCaller;
        this.reconnect = () => {
            this.reconnectTimer.clear();
            if (!this.isConnected) {
                this.logger.info(`Trying to connect again`, { logPrefix: this.id });
                this.connect(true);
            }
        };
        this.connect = (reconnect) => {
            this.protocol.restartTmpProps();
            const callback = () => {
                if (reconnect)
                    this.trigger("reconnectConnection");
                this.isConnected = true;
                this.logger.info(`TCP Enpoint connected. Timeout: ${this.timeout} - IsSecure: ${this.isSecure}`, {
                    logPrefix: this.id,
                });
            };
            const connection = this.isSecure
                ? tls_1.default.connect({ host: this.ip, port: this.port, secureOptions: SecureOptions_1.secureOptions }, callback)
                : net_1.default.connect({ host: this.ip, port: this.port }, callback);
            this.setConnection(connection);
        };
        this.init = () => {
            this.connect();
            this.on("closeConnection", () => {
                if (this.reconnectTimer.cleared) {
                    this.reconnectTimer.set();
                }
            });
        };
        this.logger.trace(`TCP Active Enpoint created. Timeout: ${timeout} - IsSecure: ${isSecure}`, {
            logPrefix: this.id,
        });
        this.isPermanent = true;
        this.reconnectTimer = new Timer_1.Timer(this.reconnect, this.reconnectTime);
        this.init();
    }
}
exports.TcpCallerEndpoint = TcpCallerEndpoint;
TcpCallerEndpoint.isInstanceOf = (obj) => obj.type === Endpoint_1.EndpointsTypes.TcpCaller;
