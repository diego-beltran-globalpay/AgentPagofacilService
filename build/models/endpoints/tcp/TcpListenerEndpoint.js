"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpListenerEndpoint = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const Endpoint_1 = require("../Endpoint");
const TcpEndpoint_1 = require("./TcpEndpoint");
class TcpListenerEndpoint extends TcpEndpoint_1.TcpEndpoint {
    constructor(connection, protocol) {
        super(protocol);
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[TcpListenerEndpoint][${this.id}]`;
        this.type = Endpoint_1.EndpointsTypes.TcpListener;
        this.logger.trace(`TCP Listener Enpoint connected.`, { logPrefix: `${connection.remoteAddress}.${connection.remotePort}` });
        this.isConnected = true;
        this.setConnection(connection);
    }
}
exports.TcpListenerEndpoint = TcpListenerEndpoint;
TcpListenerEndpoint.isInstanceOf = (obj) => obj.type === Endpoint_1.EndpointsTypes.TcpListener;
