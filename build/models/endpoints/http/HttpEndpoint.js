"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpEndpoint = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const Endpoint_1 = require("../Endpoint");
const Events_1 = require("../../Events");
class HttpEndpoint extends Endpoint_1.Endpoint {
    constructor(formatters) {
        super();
        this.formatters = formatters;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.events = new Events_1.Events({ newMessage: [] });
        this.getFormatters = (key) => {
            if (!this.formatters[key])
                throw new Error(`formatter ${key} not available`);
            return this.formatters[key];
        };
    }
    get id() {
        return `${this.ip}:${this.port}`;
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
exports.HttpEndpoint = HttpEndpoint;
HttpEndpoint.isInstanceOf = (obj) => obj.type === Endpoint_1.EndpointsTypes.HttpCaller || obj.type === Endpoint_1.EndpointsTypes.HttpListener;
