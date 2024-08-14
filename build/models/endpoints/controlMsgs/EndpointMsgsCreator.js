"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointMsgsCreator = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const Message_1 = require("../../messages/Message");
class EndpointMsgsCreator {
    constructor(endpointStates, initState, keepAliveMsgs, interval) {
        this.endpointStates = endpointStates;
        this.initState = initState;
        this.keepAliveMsgs = keepAliveMsgs;
        this.interval = interval;
        this.endpoints = {};
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.setLogPrefix = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
        };
        setInterval(() => {
            this.sendMsgs();
        }, interval);
        setInterval(() => {
            this.cleanDiscEndpoints();
        }, interval / 2);
    }
    innerAddEndpoint(endpoint) {
        this.endpoints[endpoint.id] = { state: this.initState, endpoint };
    }
    cleanDiscEndpoints() {
        for (const epID in this.endpoints) {
            const { isPermanent, isConnected } = this.endpoints[epID].endpoint;
            if (!isPermanent && !isConnected)
                delete this.endpoints[epID];
        }
    }
    getInitBody(endpoint) {
        const body = {
            status: {
                messageReceivedCounter: endpoint.stats.messageReceivedCounter,
                messageSentCounter: endpoint.stats.messageSentCounter,
                messageReplyCounter: endpoint.stats.messageReplyCounter,
                testMessagesSentCounter: endpoint.stats.testMessagesSentCounter,
                lastReceivedFromTarget: endpoint.stats.lastReceived,
                createTime: endpoint.stats.createDateTime,
            },
        };
        return new Message_1.Message(Buffer.from(JSON.stringify(body), "utf-8"));
    }
}
exports.EndpointMsgsCreator = EndpointMsgsCreator;
