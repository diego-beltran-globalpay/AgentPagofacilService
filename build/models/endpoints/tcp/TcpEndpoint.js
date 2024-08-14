"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpEndpoint = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const Endpoint_1 = require("../Endpoint");
const Events_1 = require("../../Events");
class TcpEndpoint extends Endpoint_1.Endpoint {
    constructor(protocol) {
        super();
        this.protocol = protocol;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[TcpEndpoint][${this.id}]`;
        this.events = new Events_1.Events({
            newMessage: [],
            endConnection: [],
            closeConnection: [],
            timeoutConnection: [],
            errorConnection: [],
            reconnectConnection: [],
        });
    }
    get id() {
        return `${this.ip}:${this.port}`;
    }
    send(message) {
        if (this.connection) {
            this.updateMsgSentCounter();
            const msgBuffer = this.protocol.getMsgToSend(message);
            this.connection.write(msgBuffer);
        }
        else {
            throw new Error(`[${this.id}] - The connection is not active, so the message cannot be sent.`);
        }
    }
    sendRawData(data) {
        if (this.connection) {
            this.connection.write(data);
        }
        else {
            throw new Error(`[${this.id}] - The connection is not active, so the message cannot be sent.`);
        }
    }
    setConnection(conn) {
        this.protocol.restartTmpProps();
        this.connection = conn;
        this.ip = this.ip || this.connection.remoteAddress;
        this.port = this.port || this.connection.remotePort;
        // Reiniciamos las estadisticas
        this.restartStats();
        // Eventos generados por la capa de protocolo
        this.protocol.removeAll();
        this.protocol.on("newPacket", (message) => {
            this.updateMsgReceivedCounter();
            this.trigger("newMessage", this, message);
        });
        this.protocol.on("sendAck", (ack) => {
            if (this.connection)
                this.connection.write(ack.value);
        });
        this.protocol.on("sendEot", (eot) => {
            if (this.connection)
                this.connection.write(eot.value);
        });
        this.protocol.on("sendNack", (nack) => {
            if (this.connection)
                this.connection.write(nack.value);
        });
        this.protocol.on("rcvAck", (ack) => {
            return;
        });
        this.protocol.on("rcvNack", (nack) => {
            this.logger.warn(`A NACK was rcv. Something went wrong with the message sent previously`, { logPrefix: this.id });
        });
        this.protocol.on("rcvEnq", (enq) => {
            if (this.connection) {
                this.logger.debug(`Sending response to ENQ. Value: ${enq.value.toString("hex")}`, { logPrefix: this.id });
                this.connection.write(enq.value);
            }
        });
        // Eventos generados propiamente por la coneccion
        //Cuando se recibe el paquete de FIN.
        this.connection.on("end", () => {
            this.logger.debug(`Connection endpoint ended`, { logPrefix: this.id });
            this.isConnected = false;
            this.trigger("endConnection");
        });
        //La conexion se cierra.
        this.connection.on("timeout", () => {
            if (this.connection)
                this.connection.end();
            this.logger.debug(`Connection endpoint reached timeout`, { logPrefix: this.id });
            this.isConnected = false;
            this.trigger("timeoutConnection");
        });
        //La conexion se cierra.
        this.connection.on("close", () => {
            if (this.connection)
                this.connection.end();
            this.logger.debug(`Connection endpoint closed`, { logPrefix: this.id });
            this.isConnected = false;
            this.trigger("closeConnection");
        });
        //Error en la conexion.
        this.connection.on("error", e => {
            this.logger.debug(`Connection endpoint error ${e}`, { logPrefix: this.id });
            this.isConnected = false;
            this.trigger("errorConnection", e);
        });
        this.connection.on("data", data => {
            this.protocol.addData(data);
        });
    }
    close() {
        if (this.connection)
            this.connection.end();
    }
    on(eventName, callback) {
        this.logger.trace(`Registering new event ${eventName}`, { logPrefix: this.id });
        this.events.on(eventName, callback);
        this.logger.trace(`Number of callbacks for the event ${eventName} registered are ${this.events.events[eventName].length}`, {
            logPrefix: this.id,
        });
    }
    trigger(eventName, ...args) {
        this.logger.trace(`Triggering event ${eventName}`, { logPrefix: this.id });
        this.events.trigger(eventName, ...args);
    }
    removeAll() {
        this.logger.trace(`Remove all listeners`, { logPrefix: this.id });
        this.events.removeAll();
    }
    remove(eventName) {
        this.logger.trace(`Remove event listener ${eventName}`, { logPrefix: this.id });
        this.events.remove(eventName);
    }
}
exports.TcpEndpoint = TcpEndpoint;
TcpEndpoint.isInstanceOf = (obj) => obj.type === Endpoint_1.EndpointsTypes.TcpCaller || obj.type === Endpoint_1.EndpointsTypes.TcpListener;
