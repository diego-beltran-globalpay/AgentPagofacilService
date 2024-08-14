"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const LoggersColletion_1 = require("../modules/logger/LoggersColletion");
class Events {
    constructor(events) {
        this.events = events;
        this.loggerInst = LoggersColletion_1.LoggerInstance.getInstance();
        this.on = (eventName, callback) => {
            const callbacks = this.events[eventName] || [];
            callbacks.push(callback);
            this.events[eventName] = callbacks;
        };
        this.trigger = (eventName, ...args) => {
            const callbacks = this.events[eventName] || [];
            callbacks.forEach(callback => {
                callback(...args);
            });
        };
        this.removeAll = () => {
            for (const eventName in this.events)
                this.events[eventName] = [];
        };
        this.remove = (eventName) => {
            this.events[eventName] = [];
        };
    }
}
exports.Events = Events;
