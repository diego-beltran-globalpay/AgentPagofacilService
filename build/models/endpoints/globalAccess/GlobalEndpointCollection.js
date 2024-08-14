"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEndpointCollection = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
class EndpointCollection {
    constructor() {
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.endpoints = {};
    }
    addEndpoint(id, connection) {
        this.endpoints[id] = connection;
    }
    getEndpoint(id) {
        return this.endpoints[id];
    }
}
class GlobalEndpointCollection {
    static get() {
        if (!this.instance)
            this.instance = new EndpointCollection();
        return this.instance;
    }
}
exports.GlobalEndpointCollection = GlobalEndpointCollection;
